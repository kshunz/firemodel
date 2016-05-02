# firemodel
Powerful Model Support for Firebase

## Getting Started

### node.js Installation

````bash
npm install --save firebase firemodel
````

### Setup

````js
var Firebase = require('firebase');
var firemodel = require('firemodel');

firemodel(Firebase);

var ref = new Firebase('https://...');

````

### Using a Model

````js
var Member = ref.model('members');
````

----------

#### Query API

-----------
Find (unique filter STRING, field filters ARRAY of STRING)
````js
Member.find('kshunz', ['username']);
Member.results.first();  //--> 'kshunz-admin'
````
````js
Member.find('kshunz');
Member.results.first();  //--> returns entire {}
````


Setter
````js
Member.set('kshunz', { active: true });
Member.save();
````

Getter
````js
Member.get('kshunz');
Member.results.first();
````

---------

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
