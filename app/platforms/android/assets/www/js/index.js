var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        //app initilization code
        document.getElementById('start-quiz').addEventListener('click', function(){
            alert('You clicked to start the quiz.')
        });

    },


};

app.initialize();
