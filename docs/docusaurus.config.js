module.exports = {
  title: 'KeepTrack',
  tagline: 'The tagline of my site',
  url: 'https://purfectliterature.github.io',
  baseUrl: '/keeptrack/',
  favicon: 'img/favicon.ico',
  organizationName: 'purfectliterature', // Usually your GitHub org/user name.
  projectName: 'keeptrack', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'KeepTrack',
      links: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'User\'s Guide',
          position: 'right',
        },
        {
          href: 'https://github.com/purfectliterature/keeptrack',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      copyright: `KeepTrack is made with ❤️ by Phillmont`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'guide',
          // Please change this to your repo.
          editUrl:
            'https://github.com/purfectliterature/keeptrack/edit/master/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
