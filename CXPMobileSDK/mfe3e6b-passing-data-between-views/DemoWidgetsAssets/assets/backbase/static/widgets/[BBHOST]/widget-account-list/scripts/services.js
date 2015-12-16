/**
 * Controllers
 * @module controllers
 */
define(function (require, exports) {

    'use strict';

    // @ngInject
    exports.AccountsList = function() {
        return {
            get: function() {
                return {
                    "id": "889e4f6e-f16f-4bbb-9335-917d3e2027e5",
                    "name": "Walter White",
                    "partyId": "3",
                    "photoUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAE0AAABNCAYAAADjCemwAAADXklEQVR4Xu3bTWsTURQG4DMJTS1NRNq0LpLWpO1eUBTc+1EU3CkF9U/5IwqKWtRVEVFwIVQsWBT8IM20tE1tp2knDaRJSMY7EfuRzNxM3g7C3DnZZk7Ap2/e3JyM2tLjJYv40ZOAxmg9ebUuZrTezRgNMGM0RkMEgBnuNEYDBIARThqjAQLACCeN0QABYISTxmiAADDCSWM0QAAY4aQxGiAAjHDSGA0QAEY4aYwGCAAjnDRGAwSAEU4aowECwAgnjdEAAWCEk8ZogAAwwkljNEAAGAl80lI3UxQ7GwP+6R5HNCLzh0nFpeLhQKDRIn0Rmno0RZFYxKMAdtl+fp/W59fVQZt8MEnRM1FMw+NUKVeijTcbCqE9FGj9jObx709kvz0z9zIUS4hOO8Wdw5ZlkRYV5eXyUCppnnW7XNgX72vhOyW2UW3QytwK1fZqarw9/ULLzmSp/1x/58uJ9K7Nr1FZL594LtCfnn6gjd0Zo8GxQceX2lncoe2F7Y7nQo02em2Uhi4OOYK1HzOOXxRatMREglI3UuI/BXSaVYtVyj/NuwY5lGjS4q80SH+uU71cZ7TjAm7FbzUtWn29SpVCRVqXoUta+naa4uNxRxTjk0HGZ6Pr50uo0GTF336AlcmFBk1W/AfGAenP9K4J+3dBKNC6FX9uNkfNepPRThT/fXHiH+o88VsNUfyvRPH/lhd/u6bySUtNpyiRSTimaOvjFhW/HC0XvUZNabSRqyM0fGnY0aL0S+zI3h7tyLyC2dcpi9Yq/uvixO+w1LXfjvbmAn0oiSYrfvukn3+S76n4Q9FpWUnx63M6VY0qGrLWnHJJkxX/5odN2vu2dyow5dBkxW9+N6nwvnBqMKXQ4hfilL6Vdi5+8QV85SVe/Ep2WnQgShMzE447/lqpRsuzy74kTKmvUW7Fb3810l/oVNs9+lHED73AfxC4Fr/4UaTwrkDmT9MPpxOvEWi05JUkJS8nnXdji2I3ttB9N4aIBhZt4PwAjd8dd/6RV6SsvFr+e4+H9+WFo58W0cjete1+3T18PrBosv0Ykh7ZjDI3wLSOGNPiiOF+N4FvdsrclsBoQCb+K1rbGimwnQY4+zbCaAAlozEaIACMcNIYDRAARjhpjAYIACOcNEYDBIARThqA9gcP5uZOjndwaQAAAABJRU5ErkJggg==",
                    "active": true,
                    "email": "walter.white@gmail.com",
                    "phone": "+1-202-555-0153",
                    "address": null,
                    "city": null,
                    "state": null,
                    "dateOfBirth": "1963-11-10",
                    "accounts": [
                        {
                            "accountName": "Standard Checking Account",
                            "accountId": "2cdb2224-8926-4b4d-a99f-1c9dfbbb4699",
                            "iban": "NL44RABO0123456789"
                        }
                    ]
                };
            }
        };
    };
});
