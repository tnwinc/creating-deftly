describe('string.js', function() {
    describe('When %# and interpolation arguments are provided', function() {
        it('should return an interpolated string', function() {
            var name = 'John';
            var challenge = 'exam';
            var day = 'Friday';
            var testString = Str('Hey %1, how\'d you do on your %2 last %3?', name, challenge, day);
            var expectedString = 'Hey John, how\'d you do on your exam last Friday?';

            expect(testString).to.equal(expectedString);
            expect(testString).to.not.equal('Hey %1, how\'d you do on your %2 last %3?');
        });
    });

    describe('When no %# are provided but extra arguments are provided', function() {
        it('should return the string without interpolation', function() {
            var name = 'John';
            var challenge = 'exam';
            var day = 'Friday';
            var testString = Str('Hey how are you?', name, challenge, day);
            var expectedString = 'Hey how are you?';

            expect(testString).to.be(expectedString);
        });
    });

    describe('When there are %# but no extra arguments provided', function() {
        it('should return the string exactly as it was typed', function() {
            var testString = Str('Hey %1, how\'d you do on your %2 last %3?');
            var expectedString = 'Hey %1, how\'d you do on your %2 last %3?';

            expect(testString).to.equal(expectedString);
            expect(testString).to.not.equal('Hey , how\'d you do on your  last ?');
        });
    })
});