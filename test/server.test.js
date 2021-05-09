const mongo = require('../server/mongo.js');

test('insertImageDoc makes proper DB calls', async () => {
    const mockClient = new MockClient()
    mongo.insertImageDoc(mockClient, 'raym', 'key1', true)

    expect(db).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(insertOne).toHaveBeenCalledTimes(1)
    expect(insertOne).toHaveBeenCalledWith(
        expect.objectContaining({ user: 'raym', key: 'key1', isPublic: true }),
    )
});

test('updateImageDocAccess makes proper DB calls', async () => {
    const mockClient = new MockClient()
    mongo.updateImageDocAccess(mockClient, 'key1', false)

    expect(db).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(updateOne).toHaveBeenCalledTimes(1)
    expect(updateOne).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'key1'}),
        expect.objectContaining({ $set: { isPublic: false }})
    )
});

test('deleteImageDoc makes proper DB calls', async () => {
    const mockClient = new MockClient()
    mongo.deleteImageDoc(mockClient, 'key1')

    expect(db).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(deleteOne).toHaveBeenCalledTimes(1)
    expect(deleteOne).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'key1' }),
    )
});

test('getPersonalImageDocs makes proper DB calls', async () => {
    const mockClient = new MockClient()
    mongo.getPersonalImageDocs(mockClient, 'raym')

    expect(db).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(find).toHaveBeenCalledTimes(1)
    expect(find).toHaveBeenCalledWith(
        expect.objectContaining({ user: 'raym' }),
    )
});

test('getPublicImageDocs makes proper DB calls', async () => {
    const mockClient = new MockClient()
    mongo.getPublicImageDocs(mockClient, 'raym')

    expect(db).toHaveBeenCalledTimes(1);
    expect(collection).toHaveBeenCalledTimes(1);
    expect(find).toHaveBeenCalledTimes(1)
    expect(find).toHaveBeenCalledWith(
        expect.objectContaining({ isPublic: true }),
    )
});

afterEach(() => {
    jest.clearAllMocks()
});


const db = jest.fn(() => new DB())
class MockClient {
    db(name) {
        return db(name)
    }
}

const collection = jest.fn(() => new Collection())
class DB {
    collection(name) {
        return collection(name)
    }
}

const insertOne = jest.fn()
const updateOne = jest.fn()
const deleteOne = jest.fn()
const find = jest.fn()
class Collection {
    insertOne(obj) {
        insertOne(obj)
    }

    updateOne(query, newValue) {
        updateOne(query, newValue)
    }

    deleteOne(query) {
        deleteOne(query)
    }

    find(query) {
        find(query)
    }
}
