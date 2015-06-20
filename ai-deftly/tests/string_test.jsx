describe('string.js', function() {
    it('should return an interpolated string', function() {
        var name = 'John';
        var challenge = 'exam';
        var day = 'Friday';
        var testString = string('Hey %1, how\'d you do on your %2 last %3?');
        var expectedString = 'Hey John, how\'d you do on your exam last Friday?';

        expect(testString).to.equal(expectedString);
    });
});