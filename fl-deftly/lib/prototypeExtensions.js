//Array Extensions
if (!Array.prototype.first) Array.prototype.first = function() {return this[0];}
if (!Array.prototype.last) Array.prototype.last = function() {return this[this.length-1];}