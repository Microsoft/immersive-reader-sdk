<html>
<head>
    <meta charset='utf-8'>
    <title>Immersive Reader Java Quickstart</title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>

    <script type='text/javascript' src='https://code.jquery.com/jquery-3.3.1.min.js'></script>
    <script type='text/javascript' src='https://contentstorage.onenote.office.net/onenoteltir/immersivereadersdk/immersive-reader-sdk.1.0.0.js'></script>
    <!-- A polyfill for Promise is needed for IE11 support -->
    <script type='text/javascript' src='https://cdn.jsdelivr.net/npm/promise-polyfill@8/dist/polyfill.min.js'></script>

    <link rel="stylesheet" href="/resources/styles.css"/>
</head>
<body>
    <header id='ir-button-area'>
        <button class='immersive-reader-button' data-button-style='iconAndText'
                onclick='handleLaunchImmersiveReader()'></button>
    </header>
    <main id='content-area'>
        <article id='ir-content'>
            <h1 id='ir-title'>Geography</h1>
            <div id='ir-text'>
                <p>The study of Earth's landforms is called physical geography. Landforms can be mountains and valleys. They
                    can also be glaciers, lakes or rivers. Landforms are sometimes called physical features. It is important
                    for students to know about the physical geography of Earth. The seasons, the atmosphere and all the
                    natural processes of Earth affect where people are able to live. Geography is one of a combination of
                    factors that people use to decide where they want to live.</p>
                <p>The physical features of a region are often rich in resources. Within a nation, mountain ranges become
                    natural borders for settlement areas. In the U.S., major mountain ranges are the Sierra Nevada, the
                    Rocky Mountains, and the Appalachians.</p>
                <p>Fresh water sources also influence where people settle. People need water to drink. They also need it for
                    washing. Throughout history, people have settled near fresh water. Living near a water source helps
                    ensure that people have the water they need. There was an added bonus, too. Water could be used as a
                    travel route for people and goods. Many Americans live near popular water sources, such as the
                    Mississippi River, the Colorado River and the Great Lakes.</p>
                <p>Mountains and deserts have been settled by fewer people than the plains areas. However, they have
                    valuable resources of their own.</p>
            </div>
        </article>
    </main>

    <div id='message'></div>

    <script type='text/javascript'>
        function handleLaunchImmersiveReader() {
            $('#message').hide();

            getTokenAndSubdomainAsync().then(function (response) {
                const token = response['token'];
                const subdomain = response['subdomain'];

                const data = {
                    title: $('#ir-title').text().trim(),
                    chunks: [{
                        content: $('#ir-text').text().trim(),
                        lang: 'en',
                        mimeType: 'text/plain'
                    }]
                };

                const options = {
                    'onExit': exitCallback
                };

                ImmersiveReader.launchAsync(token, subdomain, data, options)
                    .catch((error) => {
                        $('#message').text('Error in launching the Immersive Reader. Check the console.').show();
                        console.log(error);
                    });
            })
            .catch(function (err) {
                $('#message').text('Error in getting the Immersive Reader token and subdomain. Check the console.').show();
                console.log(err);
            });
        }

        function exitCallback() {
            console.log('This is the callback function.');
        }

        function getTokenAndSubdomainAsync() {
            return new Promise(function (resolve, reject) {
                $.ajax({
                    url: '/getAuthTokenServlet',
                    type: 'GET',
                    success: function (response) {
                        const data = JSON.parse(response);

                        if (data.error) {
                            reject(data.error);
                        } else {
                            const token = data['access_token'];
                            const subdomain = '<%= Microsoft.ImmersiveReader.GetAuthTokenServlet.SUBDOMAIN %>';
                            resolve({token, subdomain});
                        }
                    },
                    error: function (err) {
                        reject(err);
                    }
                });
            });
        }
    </script>
</body>
</html>