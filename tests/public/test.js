// Generated by CoffeeScript 1.6.3
var A, Author, AuthorsColl, B, Book, BooksColl, Publisher, PublishersColl, Wife, assert, expect, should;

should = chai.should();

expect = chai.expect;

assert = chai.assert;

it('BackboneJJRelational should be present', function() {
  return should.exist(Backbone.JJRelational);
});

A = Backbone.JJRelationalModel.extend({
  storeIdentifier: 'A',
  relations: [
    {
      type: 'many_many',
      relatedModel: 'B',
      key: 'bs',
      reverseKey: 'as'
    }
  ]
});

B = Backbone.JJRelationalModel.extend({
  storeIdentifier: 'B',
  urlRoot: '/api/B',
  relations: [
    {
      type: 'many_many',
      relatedModel: 'A',
      key: 'as',
      reverseKey: 'bs'
    }
  ]
});

Author = Backbone.JJRelationalModel.extend({
  storeIdentifier: 'Author',
  urlRoot: 'api/Author',
  relations: [
    {
      type: 'has_one',
      relatedModel: 'Wife',
      key: 'wife',
      reverseKey: 'husband',
      includeInJSON: ['id']
    }, {
      type: 'has_many',
      relatedModel: 'Book',
      collectionType: 'Books',
      key: 'books',
      reverseKey: 'author',
      includeInJSON: ['id']
    }, {
      type: 'many_many',
      relatedModel: 'Publisher',
      collectionType: 'Publishers',
      key: 'publishers',
      reverseKey: 'authors',
      includeInJSON: ['id']
    }
  ]
});

Wife = Backbone.JJRelationalModel.extend({
  storeIdentifier: 'Wife',
  relations: [
    {
      type: 'has_one',
      relatedModel: 'Author',
      key: 'husband',
      reverseKey: 'wife',
      includeInJSON: ['id']
    }
  ]
});

Book = Backbone.JJRelationalModel.extend({
  storeIdentifier: 'Book',
  urlRoot: 'api/Book',
  relations: [
    {
      type: 'has_one',
      relatedModel: 'Author',
      key: 'author',
      reverseKey: 'books',
      includeInJSON: ['id']
    }
  ]
});

Publisher = Backbone.JJRelationalModel.extend({
  storeIdentifier: 'Publisher',
  relations: [
    {
      type: 'many_many',
      relatedModel: 'Author',
      collectionType: 'Authors',
      key: 'authors',
      reverseKey: 'publishers',
      includeInJSON: ['id']
    }
  ]
});

AuthorsColl = Backbone.Collection.extend({
  model: Author,
  url: 'api/Author'
});

BooksColl = Backbone.Collection.extend({
  model: Book,
  url: 'api/Book'
});

PublishersColl = Backbone.Collection.extend({
  model: Publisher,
  url: 'api/Publisher'
});

Backbone.JJRelational.registerCollectionTypes({
  'Books': BooksColl,
  'Publishers': PublishersColl,
  'Authors': AuthorsColl
});

describe('Backbone JJStore', function() {
  var a, b;
  b = new Book({
    title: 'Harry Potter',
    id: 999
  });
  a = new A({
    id: 'foobar'
  });
  it('should find Harry Potter _byId', function() {
    return Backbone.JJStore._byId('Book', b.id).get('title').should.equal('Harry Potter');
  });
  return it('should remove model from store without problems', function() {
    console.log(Backbone.JJStore._byId('A', 'foobar'));
    Backbone.JJStore.__removeModelFromStore(a);
    return should.not.exist(Backbone.JJStore._byId('A', 'foobar'));
  });
});

describe('New author', function() {
  var a;
  a = new Author();
  it('should have property `wife`', function() {
    return a.attributes.should.have.property('wife', null);
  });
  it('should have instance of BooksColl as attribute `books`', function() {
    return a.attributes.books.should.be.an["instanceof"](BooksColl);
  });
  return it('should have instance of PublishersColl as attribute `publishers`', function() {
    return a.attributes.publishers.should.be.an["instanceof"](PublishersColl);
  });
});

describe('Testing setting/adding/removing from relations', function() {
  var orwell;
  orwell = new Author({
    name: 'George Orwell'
  });
  describe('HasOne Relation', function() {
    var eileen;
    eileen = new Wife({
      name: 'Eileen'
    });
    orwell.set({
      wife: eileen
    });
    it('Adding Eileen to Orwell: Eileen should have George Orwell as husband', function() {
      return eileen.get('husband').get('name').should.equal('George Orwell');
    });
    it('Removing Orwell from Eileen: Orwell\'s wife should be null', function() {
      eileen.set({
        husband: null
      });
      return orwell.attributes.should.have.property('wife', null);
    });
    return it('Adding a wife ID to Orwell should sync', function() {
      var w;
      w = new Wife({
        name: 'Some random hoe',
        id: 1000
      });
      orwell.set({
        wife: 1000
      });
      return orwell.get('wife').get('name').should.equal('Some random hoe');
    });
  });
  describe('HasManyRelation', function() {
    var book1984;
    book1984 = new Book({
      title: '1984'
    });
    orwell.get('books').add(book1984);
    it('Adding 194 to Orwell: 1984 should have George Orwell as author', function() {
      return book1984.get('author').should.equal(orwell);
    });
    it('Removing Orwell from 1984: Orwell should have no books', function() {
      book1984.set({
        author: null
      });
      return orwell.get('books').length.should.equal(0);
    });
    return it('Adding book ID to Orwell should sync', function() {
      var randomBook;
      randomBook = new Book({
        name: 'Book he never wrote',
        id: 1000
      });
      orwell.get('books').add(1000);
      return randomBook.get('author').should.equal(orwell);
    });
  });
  return describe('ManyManyRelation', function() {
    orwell.get('publishers').add([
      {
        name: 'Random House'
      }, {
        name: 'Heine Hardcore'
      }
    ]);
    it('Orwells publishers should also have him as author', function() {
      var ok;
      ok = true;
      orwell.get('publishers').each(function(publisher) {
        if (!publisher.get('authors').findWhere({
          name: 'George Orwell'
        })) {
          return ok = false;
        }
      });
      return ok.should.equal(true);
    });
    it('Removing orwell from one of his publishers should leave him with only one publisher', function() {
      var pub;
      pub = orwell.get('publishers').models[0];
      pub.get('authors').remove(orwell);
      return orwell.get('publishers').length.should.equal(1);
    });
    it('Resetting relational collection should sync', function() {
      var pub;
      pub = orwell.get('publishers').models[0];
      pub.get('authors').reset({
        name: 'J.K. Rowling'
      });
      return orwell.get('publishers').length.should.equal(0);
    });
    return it('Adding publisher ID to Orwell should sync', function() {
      var randomPublisher;
      randomPublisher = new Publisher({
        name: 'PubSub',
        id: 1000
      });
      orwell.get('publishers').add(1000);
      return randomPublisher.get('authors').models[0].should.equal(orwell);
    });
  });
});

describe('Deep relations (almost true love) and smart update', function() {
  var feast, harper, windsOfWinter;
  windsOfWinter = new Book({
    title: 'Winds of winter',
    id: 20
  });
  feast = new Book({
    title: 'A feast for crows',
    id: 21
  });
  harper = null;
  it('Martin should have relations to books with ids 20, 21, 22', function() {
    var book, id, martin, _i, _len, _ref, _results;
    harper = new Publisher({
      name: 'HarperVoyager',
      id: 20,
      authors: [
        {
          id: 20,
          name: 'Martin',
          books: [
            20, feast, {
              title: 'Storm of swords',
              id: 22
            }
          ]
        }
      ]
    });
    martin = harper.get('authors').get(20);
    martin.get('books').length.should.equal(3);
    _ref = [20, 21, 22];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      book = martin.get('books').get(id);
      _results.push(book.get('author').should.equal(martin));
    }
    return _results;
  });
  it('Model should be the same, but name should have changed', function() {
    var martin;
    martin = harper.get('authors').get(20);
    harper.get('authors').add({
      id: 20,
      name: 'George R.R.Martin'
    });
    harper.get('authors').get(20).cid.should.equal(martin.cid);
    return harper.get('authors').get(20).get('name').should.equal('George R.R.Martin');
  });
  it('Martin should have relations to books with ids 20, 22, 23, 24 and 25 in idQueue', function() {
    var book, clash, game, id, martin, _i, _len, _ref;
    clash = new Book({
      id: 23,
      title: 'Clash of Kings'
    });
    game = new Book({
      id: 24,
      title: 'Game of thrones'
    });
    martin = harper.get('authors').get(20);
    martin.get('books').set([
      {
        id: 20,
        title: "The winds of winter"
      }, 23, game, 22, 25
    ]);
    martin.get('books').length.should.equal(4);
    _ref = [20, 22, 23, 24];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      id = _ref[_i];
      book = martin.get('books').get(id);
      book.get('author').should.equal(martin);
    }
    return martin.get('books')._relational.idQueue[0].should.equal(25);
  });
  return it('windsofWinter\'s title should have changed', function() {
    return windsOfWinter.get('title').should.equal('The winds of winter');
  });
});

describe('Validation', function() {
  var a;
  a = new Author({
    id: 50,
    name: 'Foo author'
  });
  a.validate = function(attrs, options) {
    if (attrs.wife.name !== 'Bar wife') {
      return true;
    }
    return false;
  };
  it('validation should fail I', function() {
    return (a.set('wife', {
      name: 'Your momma'
    }, {
      validate: true
    })).should.equal(false);
  });
  return it('_prepareModel should return false => no relation to set', function() {
    var b, p;
    p = new Publisher({
      name: 'foobario'
    });
    p.get('authors').add([
      {
        id: 50,
        wife: {
          name: 'Your momma'
        }
      }
    ], {
      validate: true
    });
    b = p.get('authors').get(50);
    should.not.exist(b);
    return should.not.exist(a.get('wife'));
  });
});

describe('Saving', function() {
  var fontane;
  fontane = new Author({
    name: 'Theodor Fontane'
  });
  return it('Should save new book and sync it correctly', function(done) {
    var irrungen;
    irrungen = new Book({
      title: 'Irrungen und Wirrungen'
    });
    fontane.get('books').add(irrungen);
    return fontane.save(null, {
      success: function() {
        if (irrungen.id && irrungen.get('author').id === fontane.id) {
          return done();
        }
      }
    });
  });
});

describe('Testing url property', function() {
  var a, w;
  a = new Author({
    name: 'foobar'
  });
  it('Should save the author and treat model A as mere JSON', function(done) {
    a.set('a', new A({
      foo: 'bar'
    }));
    return a.save(null, {
      success: function() {
        return done();
      }
    });
  });
  w = new Wife({
    title: 'foobar2'
  });
  return it('Should treat the As as pure JSON', function(done) {
    a.set('wife', w);
    return a.save(null, {
      success: done()
    });
  });
});

describe('Fetching', function() {
  var authColl;
  authColl = new AuthorsColl();
  before(function(done) {
    return authColl.fetch({
      success: function() {
        return done();
      }
    });
  });
  return it('should successfully `fetchByIdQueueOfModels` related books', function(done) {
    var bookCount;
    bookCount = 0;
    return authColl.fetchByIdQueueOfModels('books', {
      success: function() {
        return done();
      }
    });
  });
});
