class ConnectedNodeStore {

    _data = [];
    static _peerNodeConnectionList = []


    constructor() {
        this._data = [];
        ConnectedNodeStore._peerNodeConnectionList = [];
    }

    add(url, childNodeArray, cluster) {
        const UserStore = require("./clientDataStore");
        const { v4: uuidv4 } = require('uuid');


        let tempArr = [];
        tempArr = childNodeArray;

        let obj = {
            id : url,
            loaded : true,
            age : 22,
            name : "S1",
            cluster : cluster
        }
        this._data.push(obj);

        if(tempArr.length !== 0) {
            tempArr.forEach(function (obj) {
                let peerObj = {
                    id :         uuidv4() //
                    ,
                    from : url,
                    to : obj.url,
                    type : "friend",
                }
                ConnectedNodeStore._peerNodeConnectionList.push(peerObj);

            })

        }
        if(UserStore.find(url) === true) {
            let peerObj = {
                id :        uuidv4() //
                ,
                from : global.globalString,
                to : url,
                type : "friend"
            }
            ConnectedNodeStore._peerNodeConnectionList.push(peerObj);
        }


    }
    getAll() {
        // return this._data.find(d => d.id === id);
        return this._data;
    }

    removeAll() {
        this._data = [];
        ConnectedNodeStore._peerNodeConnectionList = [];
        let serverObj = {
            id :  global.globalString,
            loaded : true,
            age : 22,
            name : "S1",
            cluster : ""
        }
        this._data.push(serverObj);
    }

    getConnectionDetails() {

        let obj = {
          nodes : this._data,
          links : ConnectedNodeStore._peerNodeConnectionList
      }
        this._data = [];
        ConnectedNodeStore._peerNodeConnectionList = [];
      return obj;
    }

    combineLists(url, list) {
        const { v4: uuidv4 } = require('uuid');
        console.log(list.links);
        ConnectedNodeStore._peerNodeConnectionList.push(...list.links);
        console.log(ConnectedNodeStore._peerNodeConnectionList);
        let peerObj = {
            id : uuidv4(),
            from : global.globalString,
            to : url,
            type : "friend"
        }
        ConnectedNodeStore._peerNodeConnectionList.push(peerObj);
        this._data.push(...list.nodes)
    }
}

const instance = new ConnectedNodeStore();

module.exports = instance;
