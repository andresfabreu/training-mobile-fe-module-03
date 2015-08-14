 /* globals define */

/**
 * Controllers
 * @module controllers
 */
define(function(require, exports) {

    'use strict';

    var _ = require('base').utils;
    var wizard = {};

    /**
     * MainCtrl description.
     */

    // @ngInject
    exports.MainCtrl = function(bpService, eBillsService, bpModel) {
        this.wizard = wizard;
        this.bpService = bpService;
        this.eBillsService = eBillsService;
        this.bpModel = bpModel;
    };

    /**
     * FindPayeeCtrl description.
     */

    // @ngInject
    exports.FindPayeeCtrl = function(lpCoreUtils, bpService, bpModel) {
        var ctrl = this;

        ctrl.searchValue = '';

        ctrl.pay = function () {
            wizard.goToStep(4);
        };

        bpService.getTopVendors()
            .then(function(vendors) {
                ctrl.topVendors = vendors;
                ctrl.listGroup = vendors;
            });

        ctrl.selectBiller = function(option) {
            bpModel.currentBiller = _.clone(option);
            bpModel.currentBiller.paymentMethod = bpModel.paymentMethods.ELECTRONIC;
            bpModel.currentBiller.address = {};
            bpModel.currentBiller.addresses = [];

            wizard.nextStep();
        };

        ctrl.createBiller = function(name) {
            bpModel.currentBiller = {
                paymentMethod: bpModel.paymentMethods.CHECK,
                name: name,
                address: {}
            };
            wizard.nextStep();
        };

        function search() {
            bpService.searchVendors({
                name: ctrl.searchValue
            }).then(function(billers) {
                if (ctrl.searchValue !== '') {
                    ctrl.listGroup = billers;
                } else {
                    ctrl.listGroup = ctrl.topVendors;
                }
            });
        }

        var lazySearch = lpCoreUtils.debounce(search, 500);

        ctrl.search = function() {
            ctrl.searching = Boolean(ctrl.searchValue);
            lazySearch();
        };

        ctrl.clearSearch = function() {
            bpService.cancelSearch();
            ctrl.searchValue = '';
            ctrl.listGroup = ctrl.topVendors;
            ctrl.searching = false;
        };
    };

    // @ngInject
    exports.ConnectPayeeCtrl = function(lpCoreUtils, bpService, eBillsService, bpModel) {
        var ctrl = this;

        ctrl.back = function(element) {
            element.ConnectForm.$setPristine();
            element.ConnectForm.submitted = false;

            bpModel.currentBiller = null;
            bpService.errors = null;

            wizard.goToStep(1);
        };

        ctrl.connect = function() {
            bpService.addPayee(bpModel.currentBiller).then(function(biller) {
                if (bpService.errors === null) {
                    bpModel.currentBiller = biller;
                    bpModel.currentBiller.connected = true;

                    if (bpModel.currentBiller.ebillEligible) {
                        ctrl.proceedToEBills();
                    }
                    wizard.nextStep();
                }
                if (biller) {
                  bpModel.currentBiller.addresses = biller.addresses;
                }
            });
        };

        ctrl.proceedToEBills = function() {
            eBillsService.fetchInfo(bpModel.currentBiller)
                .then(function(info) {
                    if (eBillsService.hasNoErrors()) {
                        bpModel.currentBiller.ebills = info;
                    }
                });
        };

        ctrl.setAccountConfirmationStatus = function(status) {
            ctrl.isAccountConfirmed = status;
        };

    };

    // @ngInject
    exports.SetupEBillsCtrl = function(bpService, eBillsService, $timeout, bpModel) {
        var ctrl = this;

        ctrl.confirm = function () {
            eBillsService.nextAction(bpModel.currentBiller.ebills)
                .then(function(info) {
                    if (eBillsService.hasNoErrors()) {
                        if (info.checkStatus) {
                            ctrl.pollStatus(bpModel.currentBiller.ebills);
                        } else {
                            bpModel.currentBiller.ebills = info;
                        }
                    }
                });
        };

        ctrl.cancel = function() {
            bpModel.currentBiller.ebillsEnabled = false;
            bpModel.currentBiller.ebills.step = bpModel.eBillSetupSteps.COMPLETE;
        };

        ctrl.pollStatus = function(timeout) {
            var time = timeout ? timeout : 0;

            $timeout(function() {
                eBillsService.checkStatus(bpModel.currentBiller.ebills)
                    .then(function(info) {
                        if (eBillsService.hasNoErrors()) {
                            if (info.checkStatus) {
                                ctrl.pollStatus();
                            } else {
                                bpModel.currentBiller.ebills = info;
                                if (bpModel.currentBiller.ebills.step === bpModel.eBillSetupSteps.COMPLETE) {
                                    bpModel.currentBiller.ebillsEnabled = true;
                                }
                            }
                        }
                    }, function() {
                      //TODO handle status check errors?
                    });
            }, time);
        };

    };

    // @ngInject
    exports.PayeeAddedCtrl = function(bpService, eBillsService, bpModel, lpCoreBus) {

        this.addNewPayee = function() {
            // This should be reviewed and perhaps changed to an event
            bpModel.currentBiller = null;
            bpModel.payment = null;
            bpService.errors = null;
            wizard.goToStep(1);
        };

        this.openDashboard = function() {
            // publish open widget event
            lpCoreBus.publish('launchpad-retail.openEBillDashboard');
        };

        this.createPayment = function() {
            bpModel.payment = {
                amount: 0,
                currencySym: '$', // TODO: Remove hardcoded currency
                scheduleDate: new Date(),
                scheduledTransfer: {
                    startDate: new Date(),
                    intervals: [],
                    timesToRepeat: 1
                }
            };
            wizard.goToStep(4);
        };
    };

    // @ngInject
    exports.PayCtrl = function(bpService, bpModel, calendarService, $filter, $scope, $q) {

        var ctrl = this;

        var formatDate = function(date) {
            return $filter('date')(date, 'yyyy-MM-dd');
        };

        var translateValue = function(value) {
            return $filter('translate')(value);
        };
        ctrl.frequencies = [];
        ctrl.endOptionsEnum = {
            AFTER: 'after',
            CANCEL: 'onCancel'
        };
        ctrl.endOptions = [
            {id: ctrl.endOptionsEnum.AFTER, value: translateValue('After')},
            {id: ctrl.endOptionsEnum.CANCEL, value: translateValue('On cancellation')}
        ];
        ctrl.isConnecting = true;

        $scope.payment = bpModel.payment;

        var updateDeliveryDate = function(startDate) {
            if (startDate) {
                var daysToDeliver = $scope.payment.urgentTransfer ? 1 : bpModel.currentBiller.businessDaysToDeliver;
                var date = formatDate(startDate);
                calendarService.getBusinessDay(date, daysToDeliver)
                    .then(function(result) {
                        $scope.payment.estDeliveryDate = result;
                    });
            }
        };

        $scope.$watch('payment.urgentTransfer', function() {
            updateDeliveryDate($scope.payment.scheduleDate);
        });

        $scope.$watch('payment.scheduleDate', function(startDate) {
            updateDeliveryDate(startDate);
        });

        this.showUrgentTransfer = function() {
            return bpModel.currentBiller.canExpeditePayments && bpModel.currentBiller.paymentMethod === bpModel.paymentMethods.CHECK;
        };

        var isValidPayment = function(payment) {
            ctrl.warnings = [];
            if (!payment.account) { ctrl.warnings.push({ code: 'ERROR_SELECT_ACCOUNT' }); }
            if (!payment.scheduleDate) { ctrl.warnings.push({ code: 'ERROR_ENTER_PROCESSING_DATE' }); }
            if (!payment.amount) { ctrl.warnings.push({ code: 'ERROR_ENTER_AMOUNT' }); }

            if (payment.isScheduledTransfer) {
                if (!payment.scheduledTransfer.frequency) { ctrl.warnings.push({ code: 'ERROR_SELECT_FREQUENCY' }); }
                if (payment.scheduledTransfer.endOn === 'after' && !payment.scheduledTransfer.timesToRepeat) { ctrl.warnings.push({ code: 'ERROR_ENTER_TIMES_TO_REPEAT' }); }
            }

            if (ctrl.warnings.length > 0) { return false; }
            return true;
        };

        this.pay = function(payment) {
            if (isValidPayment(payment)) {
                // Transform to
                var pay = {
                    payeeId: bpModel.currentBiller.payeeId,
                    accountCode: $scope.payment.account.identifier,
                    amount: $scope.payment.amount,
                    memo: $scope.payment.memo
                };

                if ($scope.payment.isScheduledTransfer) {
                    pay.frequency = $scope.payment.scheduledTransfer.frequency || 'OneTime';
                    pay.processingDate = formatDate($scope.payment.scheduledTransfer.startDate);

                    if ($scope.payment.scheduledTransfer.endOn === ctrl.endOptionsEnum.CANCEL) {
                        pay.repeatUntilCanceled = true;
                    } else {
                        pay.numberOfPayments = $scope.payment.scheduledTransfer.timesToRepeat;
                    }
                } else {
                    pay.frequency = 'OneTime';
                    pay.processingDate = formatDate($scope.payment.scheduleDate);
                    pay.repeatUntilCanceled = false;
                    pay.numberOfPayments = 1;
                }

                bpService.makeAPayment({ payment: pay }).then(function(results) {
                    if (bpService.errors === null) {
                        payment.sent = true;
                    }
                });
            }
        };

        this.cancel = function() {
             wizard.goToStep(1);
        };

        // Load necessary resources
        var accounts = bpService.getAccounts();
        var frequencies = bpService.getFrequencies();
        var payee = bpService.fetchPayee(bpModel.currentBiller);

        $q.all([ accounts, frequencies, payee ]).then(function(results) {
            ctrl.accounts = results[0];
            ctrl.frequencies = results[1];
            ctrl.eBills = results[2].eBill;

            // Defualt account if primary exists
            _.forEach(ctrl.accounts, function(value, key) {
                if (value.isPrimaryAccount) {
                    $scope.payment.account = value;
                    return;
                }
            });
        }, function(errObj){
            // TODO: log to screen about data fetch problems
        })['finally'](function() {
            ctrl.isConnecting = false;
        });
    };

    // @ngInject
    exports.ConfigureCtrl = function(fiService) {
        var ctrl = this;
        ctrl.fiModel = fiService.fiModel;
        ctrl.goBack = wizard.previousStep;
    };

});
