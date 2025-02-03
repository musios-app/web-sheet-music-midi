class EventEmitter {
    constructor() {
        this.events = {};
    }

    // Method to add an event listener
    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    // Method to remove an event listener
    off(event, listenerToRemove) {
        if (!this.events[event]) return;

        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }

    // Method to trigger an event
    emit(event, ...args) {
        if (!this.events[event]) return;

        this.events[event].forEach(listener => {
            listener(...args);
        });
    }
}

// Example class using EventEmitter
class MyClass extends EventEmitter {
    constructor() {
        super();
    }

    doSomething() {
        console.log("Doing something...");
        this.emit('done', 'Some data'); // Trigger 'done' event
    }
}

// Example usage
const myInstance = new MyClass();

// Add event listener
myInstance.on('done', (data) => {
    console.log('Done event triggered with data:', data);
});

// Trigger the event
myInstance.doSomething(); // Output: Doing something... \n Done event triggered with data: Some data