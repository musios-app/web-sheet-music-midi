
const sheetData = {
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