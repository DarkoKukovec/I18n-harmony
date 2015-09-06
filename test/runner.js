/* global I18n, chai */

mocha.setup('bdd');
describe('Browser global', function () {
  it('should initialize', function () {
    I18n.init({ active: 'test' });

    chai.expect(I18n.locale).to.equal('test');
  });
});
mocha.run();
