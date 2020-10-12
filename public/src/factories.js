angular.module('ContactsApp')
    .factory('Contact', function($resource){
        return $resource('/api/contact/:id',{id:'@id'},{
            'update':{method: 'PUT'}
        });
    })
    .factory('Fields',function($q, $http, Contact){
        var url = '/options/displayed_field',
        ignore = ['firstName','lastName','id','userId'],
        allFields = [],
        deferred = $q.defer(),

        contacts = Contacts.query(function(){
            contacts.forEach(e => {
                Object.key(e).forEach(function(k){
                    if(allFields.indexOf(e) <0 && ignore.indexOf(e) < 0) allFields.push(k)
                })
            });
            deferred.resolve(allFields);
        });

        return {
            get:function(){
               return $http.get(url);
            },
            set:function(newFields){
               return $http.post(url, {fields : newFields})
            },
            headers: function(){
                return deferred.promise;
            }
        }
    })