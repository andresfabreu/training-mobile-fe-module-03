define("launchpad/lib/accounts/demo",[
    "angular",
    "launchpad/lib/accounts/accounts-module"
    ], function(angular, module) {
        "use strict";

        module.value('widget', {
            getPreferenceFromParents: function (argument) {
                return '';
            }
        });

        module.controller('DemoFormatCtrl', ['$scope', function($scope) {
            $scope.account = {
                currency: 'EUR',
                balance: 123.456
            };
        }]);

        module.controller('DemoAccountsCtrl', ['$scope', function($scope) {
            $scope.accounts = [
                {
                    availableBalance: -11738,
                    balance: -11738,
                    bban: "842497587",
                    currency: "EUR",
                    delta: 0,
                    groupCode: "CREDIT",
                    iban: "NL67RABO0842497587",
                    id: "2524755b-4967-46f5-9785-9259c78efc40",
                    name: "Business Account",
                    partyId: "3",
                    status: "ENABLED"
                },
                {
                    availableBalance: 6453,
                    balance: 6453,
                    bban: "280680457",
                    currency: "EUR",
                    delta: 0,
                    groupCode: "CASH",
                    iban: "NL66INGB0280680457",
                    id: "6c47dcbd-cda1-4c6e-b57a-06049c87c7c6",
                    name: "Personal Checking Account",
                    partyId: "3",
                    status: "ENABLED"
                },
                {
                    availableBalance: 11340,
                    balance: 11340,
                    bban: "519431642",
                    currency: "EUR",
                    delta: 0,
                    groupCode: "INVESTMENT",
                    iban: "NL56ABNA0519431642",
                    id: "2768f2af-37ab-421b-974b-44a3b79dedae",
                    name: "Shared Account",
                    partyId: "3",
                    status: "BLOCKED"
                }
            ];

            $scope.currentAccount = $scope.accounts[1];
        }]);
});