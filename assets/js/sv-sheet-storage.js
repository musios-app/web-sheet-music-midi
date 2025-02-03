
const databaseName = "musios.app-sheetviewer"
const sheetStoreName = "sheets"
const versionNumber = 1

class SheetData {
    static #instance = null;

    constructor() {
        if (SheetData.#instance) {
            throw new Error("Use SheetData.init() to get the single instance of this class.")
        }
        this.db = null
    }

    static async getInstance() {
        if (SheetData.#instance) return SheetData.#instance

        SheetData.#instance = new SheetData()
        
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(databaseName, versionNumber)

            request.onsuccess = function(event) {
                console.debug("Database opened successfully")
                SheetData.#instance.db = event.target.result
                console.log(SheetData.#instance)
                resolve(SheetData.#instance)
            }
    
            request.onerror = function(event) {
                console.error(`Database error: ${event.target.error?.message}`);
                reject(event.target.error)
            }
    
            request.onupgradeneeded = function(event) {
                console.debug("Database create/upgrade needed")
                SheetData.#instance.db = event.target.result

                const storeRequest = SheetData.#instance.db.createObjectStore(sheetStoreName, { keyPath: "filename" })
                storeRequest.onsuccess = function(event) {
                    console.debug("Sheet store created successfully")
                    resolve(SheetData.#instance)
                }

                storeRequest.onerror = function(event) {
                    console.error(`Sheet store error: ${event.target.error?.message}`);
                    reject(event.target.error)
                }
                // const objectStore = SheetData.#instance.db.createObjectStore(sheetStoreName, { keyPath: "filename" });
                // resolve(SheetData.#instance)
            };
        })
    }

    async addSheet(filename, filetype, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(sheetStoreName, "readwrite");
            const objectStore = transaction.objectStore(sheetStoreName);

            const request = objectStore.put({ filename, filetype, data });

            request.onsuccess = (event) => {
                console.debug("Sheet added successfully");
                resolve();
            };

            request.onerror = (event) => {
                console.error(`Sheet add error: ${event.target.error?.message}`);
                reject(event.target.error);
            };
        });
    }

    async getSheetNames() {
        console.log("getSheetNames")
        console.log(this.db)
        console.log("sheetStoreName", sheetStoreName)

        return new Promise((resolve, reject) => {
            console.log("getSheetNames promise")
            console.log(this)
            console.log("this.db", this.db)
            console.log("sheetStoreName", sheetStoreName)

            const transaction = this.db.transaction(sheetStoreName, "readonly");
            const objectStore = transaction.objectStore(sheetStoreName);

            const request = objectStore.getAllKeys();

            request.onsuccess = (event) => {
                resolve(event.target.result);
            };

            request.onerror = (event) => {
                console.error(`Sheet get error: ${event.target.error?.message}`);
                reject(event.target.error?.message);
            };
        });
    }

    getSheet(filename, success = null, error = null) {
        const transaction = this.db.transaction(sheetStoreName, "readonly");
        const objectStore = transaction.objectStore(sheetStoreName);

        const request = objectStore.get(filename);

        request.onsuccess = (event) => {
            success && success(event.target.result);
        };

        request.onerror = (event) => {
            console.error(`Sheet get error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        };
    }

    deleteDatabase(success = null, error = null) {
        const request = window.indexedDB.deleteDatabase(databaseName, versionNumber);

        request.onsuccess = (event) => {
            console.log("Database deleted successfully");
            success && success();
        };

        request.onerror = (event) => {
            console.error(`Database error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        };
    }
}


/*
const sheetData = {

    const sheetData = new SheetData();
    db: null,
    databaseName: "musios.app",
    sheetStoreName: "sheets",
    versionNumber: 1,

    init: (success=null, error=null) => {
        const request = window.indexedDB.open(sheetData.databaseName, sheetData.versionNumber);

        request.onupgradeneeded = (event) => {
            sheetData.db = event.target.result;
            console.log("Database upgrade needed");
            const objectStore = sheetData.db.createObjectStore(sheetData.sheetStoreName, { keyPath: "filename" });
        
            // objectStore.transaction.oncomplete = (event) => {
            //     const sheetObjectStore = 
            //         sheetData.db
            //             .transaction("sheets", "readwrite")
            //             .objectStore("sheets");
            // }
        };
        
        request.onsuccess = (event) => {
            console.log("Database openned successfully");
            sheetData.db = event.target.result;
            success && success();
        }

        request.onerror = (event) => {
            console.error(`Database error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    },

    addSheet: (filename, filetype, data, success=null, error=null) => {
        const transaction = sheetData.db.transaction(sheetData.sheetStoreName, "readwrite");
        const objectStore = transaction.objectStore(sheetData.sheetStoreName);

        const request = objectStore.put({ filename, filetype, data } );

        request.onsuccess = (event) => {
            console.log("Sheet added successfully");
            success && success();
        }

        request.onerror = (event) => {
            console.error(`Sheet add error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    },

    getSheetNames(success=null, error=null) {
        const transaction = sheetData.db.transaction(sheetData.sheetStoreName, "readonly");
        const objectStore = transaction.objectStore(sheetData.sheetStoreName);

        const request = objectStore.getAllKeys();

        request.onsuccess = (event) => {
            success && success(event.target.result);
        }

        request.onerror = (event) => {
            console.error(`Sheet get error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    },

    getSheet(filename, success=null, error=null) {
        const transaction = sheetData.db.transaction(sheetData.sheetStoreName, "readonly");
        const objectStore = transaction.objectStore(sheetData.sheetStoreName);

        const request = objectStore.get(filename);

        request.onsuccess = (event) => {
            success && success(event.target.result);
        }

        request.onerror = (event) => {
            console.error(`Sheet get error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    },

    deleteDatabase(success=null, error=null) {
        const request = window.indexedDB.deleteDatabase(sheetData.databaseName, sheetData.versionNumber);

        request.onsuccess = (event) => {
            console.log("Database deleted successfully");
            success && success();
        }

        request.onerror = (event) => {
            console.error(`Database error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    }


}

*/