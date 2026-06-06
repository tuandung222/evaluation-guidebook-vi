import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

const config: Config = {
  title: 'Cẩm nang Đánh giá LLM',
  tagline: 'Bản dịch tiếng Việt "LLM Evaluation Guidebook" của HuggingFace',
  favicon: 'img/logo.svg',

  // Set the production url of your site here
  url: 'https://tuandung222.github.io',
  // Set the /<projectName>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/evaluation-guidebook-vi/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'tuandung222', // Usually your GitHub org/user name.
  projectName: 'evaluation-guidebook-vi', // Usually your repo name.

  onBrokenLinks: 'warn',
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'vi',
    locales: ['vi'],
  },

  future: {
    v4: true,
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: ['@docusaurus/theme-mermaid'],

  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      type: 'text/css',
      integrity:
        'sha384-n8MVdqiI7+t84GBSAlkZFP3qxmcArtr2WwHXYQJ90R9xg1f1TXEipb_mAGPge5yG',
      crossorigin: 'anonymous',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/logo.svg',
    colorMode: {
      defaultMode: 'dark',
      disableSwitch: false,
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'Evaluation Guidebook VI',
      logo: {
        alt: 'Evaluation Guidebook VI Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: 'Cẩm nang',
        },
        {
          href: 'https://github.com/tuandung222/evaluation-guidebook-vi',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Nội dung',
          items: [
            {
              label: 'Kiến thức Chung',
              to: '/docs/category/general-knowledge',
            },
            {
              label: 'Đánh giá Tự động',
              to: '/docs/category/automated-benchmarks',
            },
            {
              label: 'Đánh giá bằng Con người',
              to: '/docs/category/human-evaluation',
            },
          ],
        },
        {
          title: 'Nâng cao',
          items: [
            {
              label: 'LLM làm Giám khảo',
              to: '/docs/category/model-as-a-judge',
            },
            {
              label: 'Giải quyết Sự cố',
              to: '/docs/category/troubleshooting',
            },
            {
              label: 'Điểm tin Hằng năm',
              to: '/docs/category/yearly-dives',
            },
          ],
        },
        {
          title: 'Cộng đồng',
          items: [
            {
              label: 'Hugging Face Evals',
              href: 'https://huggingface.co/docs/lighteval/index',
            },
            {
              label: 'GitHub Repository',
              href: 'https://github.com/tuandung222/evaluation-guidebook-vi',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Cẩm nang Đánh giá LLM. Bản dịch tiếng Việt của HuggingFace LLM Evaluation Guidebook.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
