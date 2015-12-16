// define([ 'angular',
// 	'jquery',
// 	'angular-mocks',
// 	'launchpad/lib/ui'], function(angular, $) {

// 	describe('UI Wizard directive', function() {

// 		var scope, $template, $element, $steps, $views, $heading;

// 		beforeEach(module('ui'));

// 		beforeEach(inject(function(_$compile_, _$rootScope_) {
// 			scope = _$rootScope_;
// 			scope.$parent = {};
// 			$template = _$compile_('<div wizard="wizard" next-step="wizardNextStep" get-active-step="getActiveWizardStep" title="Some wizard title"><div heading="Step 1" wizard-step=""></div><div heading="Step 2" wizard-step=""></div></div>')(scope);
// 			$element = $template;
// 			scope.$digest();
// 			$steps = $element.find('div.wizard-steps');
// 			$views = $element.find('div.wizard-view');
// 			$heading = $element.find('h3');
// 		}));


// 		xit('Should bind step titles', function() {
// 			expect($steps.children().eq(0).find('.wizard-step-heading').text().trim()).toBe('Step 1');
// 			expect($steps.children().eq(1).find('.wizard-step-heading').text().trim()).toBe('Step 2');
// 		});
// 		it('Should bind wizard heading', function() {
// 			expect($heading.text()).toBe('Some wizard title');
// 		});
// 		it('Should return active step index',function() {
// 			expect(scope.$parent.getActiveWizardStep()).toEqual(1);
// 			scope.$parent.wizardNextStep();
// 			expect(scope.$parent.getActiveWizardStep()).toEqual(2);
// 		});
// 		xit('Step 1 should be selected by default',function() {
// 			expect($steps.find('.wizard-step').eq(0).hasClass('wizard-active-step')).toBe(true);
// 			expect($views.find('.wizard-view').eq(0).hasClass('ng-hide')).toBe(false);
// 		});
// 	});
// });
