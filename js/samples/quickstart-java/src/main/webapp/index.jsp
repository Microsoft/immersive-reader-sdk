<%@ page contentType="text/html; charset=UTF-8" %>
<html>
<head>
    <meta charset='utf-8'>
    <title>Immersive Reader Java Quickstart</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/resources/site.css" />

    <script type='text/javascript' src='https://code.jquery.com/jquery-3.3.1.min.js'></script>
    <script type='text/javascript' src='https://contentstorage.onenote.office.net/onenoteltir/immersivereadersdk/immersive-reader-sdk.0.5.8.js'></script>
    <!-- A polyfill for Promise is needed for IE11 support -->
    <script type='text/javascript' src='https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js'></script>

    <style type="text/css">
        .immersive-reader-button {
            background-color: white;
            margin-top: 5px;
            border: 1px solid black;
            float: right;
        }
    </style>
</head>
<body>
    <div class="container">
        <button class="immersive-reader-button" data-button-style="iconAndText" data-locale="en"></button>
    
        <h1 id="ir-title">About Immersive Reader</h1>
        <div id="ir-content" lang="en-us">
            <p>
                Immersive Reader is a tool that implements proven techniques to improve reading comprehension for emerging readers, language learners, and people with learning differences.
                The Immersive Reader is designed to make reading more accessible for everyone. The Immersive Reader
                <ul>
                    <li>
                        Shows content in a minimal reading view
                    </li>
                    <li>
                        Displays pictures of commonly used words
                    </li>
                    <li>
                        Highlights nouns, verbs, adjectives, and adverbs
                    </li>
                    <li>
                        Reads your content out loud to you
                    </li>
                    <li>
                        Translates your content into another language
                    </li>
                    <li>
                        Breaks down words into syllables
                    </li>
                </ul>
            </p>
            <h3>
                The Immersive Reader is available in many languages.
            </h3>
            <p lang="es-es">
                El Lector inmersivo está disponible en varios idiomas.
            </p>
            <p lang="zh-cn">
                沉浸式阅读器支持许多语言
            </p>
            <p lang="de-de">
                Der plastische Reader ist in vielen Sprachen verfügbar.
            </p>
            <p lang="ar-eg" dir="rtl" style="text-align:right">
                يتوفر \"القارئ الشامل\" في العديد من اللغات.
            </p>
        </div>
    </div>

    <script type='text/javascript'>
        function getTokenAsync() {
                return new Promise(function (resolve, reject) {
                    $.ajax({
                        url: "/getAuthTokenServlet",
                        type: "GET",
                        success: function (data) {
                            if (data.error) {
                                reject(data.error);
                            } else {
                                resolve(data);
                            }
                        },
                        error: function (err) {
                            reject(err);
                        }
                    });
                });
            }
        
        $(".immersive-reader-button").click(function () {
            handleLaunchImmersiveReader();
        });

        function handleLaunchImmersiveReader() {
            getTokenAsync()
                .then(function (response) {
                    const token = response;
                    // Learn more about chunk usage and supported MIME types https://docs.microsoft.com/azure/cognitive-services/immersive-reader/reference#chunk
                    const data = {
                        title: $("#ir-title").text(),
                        chunks: [{
                            content: $("#ir-content").html(),
                            mimeType: "text/html"
                        }]
                    };
                    // Learn more about options https://docs.microsoft.com/azure/cognitive-services/immersive-reader/reference#options
                    const options = {
                        "onExit": exitCallback,
                        "uiZIndex": 2000
                    };
                    // The Office compliant token does not require a subdomain, use null instead.
                    ImmersiveReader.launchAsync(token, null, data, options)
                        .catch(function (error) {
                            alert("Error in launching the Immersive Reader. Check the console.");
                            console.log(error);
                        });
                })
                .catch(function (error) {
                    alert("Error in getting the Immersive Reader. Check the console.");
                    console.log(error);
                });
        }

        function exitCallback() {
            console.log("This is the callback function. It is executed when the Immersive Reader closes.");
        }
    </script>
</body>
</html>