# FIREMODEL
Powerful Model Support for Firebase

## Getting Started

### node.js Installation

````bash
npm install --save firebase firemodel
````
````js
var Firebase = require('firebase');
var firemodel = require('firemodel');
````


### Web Installation

````bash
bower install --save firemodel

````

### Setup

------------

````js

firemodel(Firebase);  //--> adds "model" to the prototype

var ref = new Firebase('https://...');

````






### Using a Model

````js
var Member = ref.model('members');

Member.set('kshunz.active', true);
Member.set('kshunz.name.first', 'K.');
Member.set('kshunz.name.last', 'Shunz');
Member.save();

````



#### Query API
-----------

Getter
````js
Member.get('kshunz');
Member.results.first();
````

Find (unique filter STRING, field filters ARRAY of STRING)
````js
Member.find();  //--> find all member records
Member.find(['username']);  //--> find all member username
Member.results.all();
````

Find (unique filter STRING, field filters ARRAY of STRING)
````js
Member.find('kshunz', ['username']);
Member.results.first();  //--> 'kshunz'
````
````js
Member.find('kshunz');
Member.results.first();  //--> returns entire {}
````


#### DAVIE (delete, add, view, index, edit) API
---------

[D]elete
````js
Member.delete('kshunz');
Member.save();
````

[A]dd
````js
Member.add({
  kshunz: {
    username: 'kshunz',
    email: 'info@kshunz.com'
  }
});

Member.save();
````

[V]iew
````js
Member.view('kshunz');

var currentMember = Member.results.first();
````

[I]ndex
````js
Member.index();
Member.results.all(); //returns all members
````


[E]dit
````js
Member.edit('kshunz.username', 'kshunz-admin');
Member.save();
````
