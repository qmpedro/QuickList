angular.module('starter')
.controller('IndexController', IndexController);

function IndexController($timeout, $cordovaToast, $ionicPlatform, $cordovaSQLite){
    var vm = this;
    vm.Add = SetNote;
    vm.CheckNote = CheckNote;

    // _____________________________________________________________

    function GetNotes() {
        $ionicPlatform.ready(function () {
            var query = "Select intNoteId, txtNote from Note";
            $cordovaSQLite.execute(db, query).then(function(res) {                                
                var listaResult = [];
                if(res.rows.length > 0) {
                    for (var i = 0; i < res.rows.length; i++) {
                        listaResult.push({ 
                            id: res.rows.item(i).intNoteId, 
                            note: res.rows.item(i).txtNote,
                        });
                    };
                }

                vm.itens = listaResult;
            }, function (err) {
                console.log(err);
            });
        });
    };

    function SetNote(note) {
        var query = "INSERT INTO Note (txtNote) VALUES (?)";
        $cordovaSQLite.execute(db, query, [note]).then(function(res) {
            GetNotes();
            vm.note = '';
            }, function (err) {
                console.error(err);
        });
    };

    function CheckNote(id) {
        console.log(id);
        $timeout(function(){
            var query = "delete from Note where intNoteId = ?";
                $cordovaSQLite.execute(db, query, [id]).then(function(res) {
                    GetNotes();
                    vm.note = '';
                    }, function (err) {
                        console.error(err);
                });
        }, 700);
    };

    vm.showToast = function(message, duration, location) {
        $cordovaToast.show(message, duration, location).then(function(success) {
        }, function (error) {
            console.log(error);
        });
    };
    
    // _____________________________________________________________
    
    GetNotes();
};