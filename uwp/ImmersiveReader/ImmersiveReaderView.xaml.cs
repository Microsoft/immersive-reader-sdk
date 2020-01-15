﻿using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;

// The User Control item template is documented at https://go.microsoft.com/fwlink/?LinkId=234236

namespace ImmersiveReader
{
    public sealed partial class ImmersiveReaderView : UserControl
    {
        public event TypedEventHandler<WebView, WebViewNavigationCompletedEventArgs> NavigationCompleted;

        public ImmersiveReaderView()
        {
            this.InitializeComponent();
        }

        public string Token
        {
            get => (string)GetValue(TokenProperty);
            set => SetValue(TokenProperty, value);
        }

        private static DependencyProperty TokenProperty = DependencyProperty.Register(
            "Token",
            typeof(string),
            typeof(ImmersiveReaderView),
            null);

        public string ReaderContent
        {
            get => (string)GetValue(ReaderContentProperty);
            set => SetValue(ReaderContentProperty, value);
        }

        private static DependencyProperty ReaderContentProperty = DependencyProperty.Register(
            "ReaderContent",
            typeof(string),
            typeof(ImmersiveReaderView),
            null);

        public string Subdomain
        {
            get => (string)GetValue(SubdomainProperty);
            set => SetValue(SubdomainProperty, value);
        }

        private static DependencyProperty SubdomainProperty = DependencyProperty.Register(
            "Subdomain",
            typeof(string),
            typeof(ImmersiveReaderView),
            null);

        public string TenantId
        {
            get => (string)GetValue(TenantIdProperty);
            set => SetValue(TenantIdProperty, value);
        }

        private static DependencyProperty TenantIdProperty = DependencyProperty.Register(
            "TenantId",
            typeof(string),
            typeof(ImmersiveReaderView),
            null);

        public string ClientId
        {
            get => (string)GetValue(ClientIdProperty);
            set => SetValue(ClientIdProperty, value);
        }

        private static DependencyProperty ClientIdProperty = DependencyProperty.Register(
            "ClientId",
            typeof(string),
            typeof(ImmersiveReaderView),
            null);

        public string ClientSecret
        {
            get => (string)GetValue(ClientSecretProperty);
            set => SetValue(ClientSecretProperty, value);
        }

        private static DependencyProperty ClientSecretProperty = DependencyProperty.Register(
            "ClientSecret",
            typeof(string),
            typeof(ImmersiveReaderView),
            null);

        public async void Start()
        {
            var script = this.GetType().GetTypeInfo().Assembly.GetManifestResourceStream("ImmersiveReader.script.txt");
            if (script == null)
            {
                throw new Exception("Error loading the immersive reader script from assembly. " +
                    "Is the script name or path correct?");
            }

            string text = "";
            using (var reader = new StreamReader(script))
            {
                text = reader.ReadToEnd();
            }

            var token = await GetTokenAsync();
            text = text.Replace("|TOKEN|", token);
            text = text.Replace("|YOUR_SUB_DOMAIN|", this.Subdomain);
            text = text.Replace("|CONTENT|", this.ReaderContent);
            MainWebView.NavigateToString(text);
        }

        private async Task<string> GetTokenAsync()
        {
            if (!string.IsNullOrWhiteSpace(this.Token))
            {
                return this.Token;
            }

            ValidateAuthStrings();

            string authority = $"https://login.windows.net/{TenantId}";
            const string resource = "https://cognitiveservices.azure.com/";

            AuthenticationContext authContext = new AuthenticationContext(authority);
            ClientCredential clientCredential = new ClientCredential(ClientId, ClientSecret);
            AuthenticationResult authResult = await authContext.AcquireTokenAsync(resource, clientCredential);

            return authResult.AccessToken;
        }

        private void ValidateAuthStrings()
        {
            if (string.IsNullOrWhiteSpace(this.TenantId))
            {
                throw new ArgumentNullException(
                    nameof(this.TenantId),
                    "Missing TenantId. Unable to fetch token.");
            }

            if (string.IsNullOrWhiteSpace(this.ClientId))
            {
                throw new ArgumentNullException(
                    nameof(this.ClientId),
                    "Missing ClientId. Unable to fetch token.");
            }

            if (string.IsNullOrWhiteSpace(this.ClientSecret))
            {
                throw new ArgumentNullException(
                    nameof(this.ClientSecret),
                    "Missing ClientSecret. Unable to fetch token.");
            }
        }

        private void MainWebView_NavigationCompleted(WebView sender, WebViewNavigationCompletedEventArgs args)
        {
            NavigationCompleted?.Invoke(sender, args);
        }
    }
}
