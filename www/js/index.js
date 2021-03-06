/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
isbn=null;
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


 function scan(){
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                  "Result: " + result.text + "\n" +
                  "Format: " + result.format + "\n" +
                  "Cancelled: " + result.cancelled);
                  getBookDetails(result.text)
                 document.getElementById("borrow").hidden = false;
        },
        function (error) {
            alert("Scanning failed: " + error);
        },
        {
            preferFrontCamera : false, // iOS and Android
            showFlipCameraButton : true, // iOS and Android
            showTorchButton : true, // iOS and Android
            torchOn: true, // Android, launch with the torch switched on (if available)
            saveHistory: true, // Android, save scan history (default false)
            prompt : "Place a barcode inside the scan area", // Android
            resultDisplayDuration: 500, // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
             // default: all but PDF_417 and RSS_EXPANDED
            orientation : "landscape", // Android only (portrait|landscape), default unset so it rotates with the device
            disableAnimations : true, // iOS
            disableSuccessBeep: false // iOS and Android
        }
     );
 }

 function search(){
     query=document.forms['search']['name'].value;
    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function()
    {
        if(this.readyState==4 && this.status==200)
        {
            if(this.responseText.localeCompare('no copies')==0)
            {   
                document.getElementById('errorbox').hidden = false;
                document.getElementById('errorbox').innerHTML='No book found';
                document.getElementById('errorbox').style='font-size: 25px; color: white; background-color: red';
            }
            else
            {	
                getBookDetails(responseText);
            }
        
        }
    };
    xhr.open('GET','../backend/search.php?+name='+query,true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
 }

 function getBookDetails(isbn) {
    // Query the book database by ISBN code.
    isbn = isbn || "9781451648546"; // Steve Jobs book 
    
    var url = "https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn;
    
    var response;
        // Get the data from the API
        $.getJSON(url, displayBooks);
    
        // We've got the JSON data. Now let's do something with it
        function displayBooks(data) {
            // Start off by defining a variable called htmlString
            var htmlString = "<div>";
            htmlString +=JSON.stringify(data);
            $('#book').html(htmlString + "</div>");
            // For each of the JSON API results... 
           $.each(data.items, function (i, item) {
                // Add some HTML with CSS
                var htmlString = "<div>";

                htmlString += '<div class="col-xs-3">';
                // Build up the HTML using the data from the API
                htmlString += '<img src="' + item.volumeInfo.imageLinks.thumbnail + '" alt="' + item.id + '" title="' + item.id + '", class ="img-thumbnail img-responsive"/><br/>';
                htmlString += '<strong class="small">Pub: ' + item.volumeInfo.publishedDate + '</strong></div>';
                htmlString += '<div class="col-xs-9"><h1>' + item.volumeInfo.title + '</h1>';
                $.each(item.volumeInfo.authors, function (i, author) {
                    htmlString += '<p class="bg-info"><i>' + author + '</i></p>';
                });
                htmlString += '<p class="small">' + item.volumeInfo.description + '</p>';
                htmlString += '<p class="well small">Extract: "' + item.searchInfo.textSnippet + '"<a href="' + item.accessInfo.webReaderLink + '" target="_blank"> Read more</a></p>';
                htmlString += '</div>';
                $('#book').html(htmlString + "</div>");
            });
            // And then wherever there's a div with an ID of 'book' in the HTML, replace it with our htmlString. See over on the right for the results!     
        }
    $('#book').html(htmlString + "</div>");}

    
  function logout(){
    sessionStorage.removeItem("uid");
    sessionStorage.removeItem("username");
    sessionStorage.removeItem("role");

    window.location.href = "./account/signup.html";


  }

  function borrow(){
    if(isbn!=null){
        xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if(this.readyState==4 && this.status==200)
            {
                if(this.responseText.localeCompare('true')==0)
                {
                    document.getElementById('errorbox').innerHTML='<center>Error in Registration<center>';
                    document.getElementById('errorbox').style='font-size: 25px; color: white; background-color: red';
                }
                else
                {	
                    getBookDetails(responseText);
                }
            
            }
        };
        xhr.open('GET','../backend/borrow.php?+isbn='+isbn,true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send(); 
    }
  }