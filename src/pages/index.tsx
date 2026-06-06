import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './index.module.css';

interface CardItem {
  title: string;
  description: string;
  link: string;
  icon: string;
}

const cards: CardItem[] = [
  {
    title: 'Kiến thức Chung',
    icon: '💡',
    description: 'Khái niệm cơ bản về suy luận (inference), tokenizer và các nguyên lý cốt lõi trong đánh giá mô hình ngôn ngữ lớn.',
    link: '/docs/category/general-knowledge',
  },
  {
    title: 'Đánh giá Tự động',
    icon: '🤖',
    description: 'Thiết kế hệ thống đánh giá tự động (automated evaluation), cách áp dụng các bộ thử nghiệm (benchmark) phổ biến.',
    link: '/docs/category/automated-benchmarks',
  },
  {
    title: 'Đánh giá bằng Con người',
    icon: '👥',
    description: 'Quy trình tuyển dụng và quản lý người gán nhãn (annotators), tính toán độ đồng thuận và giảm thiểu sai số.',
    link: '/docs/category/human-evaluation',
  },
  {
    title: 'LLM làm Giám khảo',
    icon: '⚖️',
    description: 'Sử dụng mô hình đóng vai trò giám khảo (model-as-a-judge), thiết kế prompt đánh giá và áp dụng reward model.',
    link: '/docs/category/model-as-a-judge',
  },
  {
    title: 'Giải quyết Sự cố',
    icon: '🔧',
    description: 'Khắc phục các sự cố thường gặp về suy luận, phân tích cú pháp toán học (math parsing) và khả năng tái lập kết quả.',
    link: '/docs/category/troubleshooting',
  },
  {
    title: 'Điểm tin Hằng năm',
    icon: '📅',
    description: 'Phân tích chuyên sâu và góc nhìn thực tiễn về đánh giá mô hình qua các năm 2023, 2024 (ICLR) và 2025.',
    link: '/docs/category/yearly-dives',
  },
];

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={styles.heroBanner}>
      <div className={styles.heroBgGlow}></div>
      <div className="container">
        <div className={styles.heroContent}>
          <div className={styles.logoWrapper}>
            <img 
              src={`${siteConfig.baseUrl}img/logo.svg`} 
              alt="Logo Cẩm nang Đánh giá LLM" 
              className={styles.heroLogo}
            />
          </div>
          <Heading as="h1" className={styles.heroTitle}>
            {siteConfig.title}
          </Heading>
          <p className={styles.heroSubtitle}>
            {siteConfig.tagline}
          </p>
          <div className={styles.buttons}>
            <Link
              className="button button--primary button--lg"
              to="/docs/gioi_thieu">
              Bắt đầu đọc cẩm nang 🚀
            </Link>
            <a
              className="button button--secondary button--lg"
              href="https://github.com/tuandung222/evaluation-guidebook-vi"
              target="_blank"
              rel="noopener noreferrer">
              Xem trên GitHub ⭐
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

export default function Home(): React.JSX.Element {
  return (
    <Layout
      title="Trang chủ"
      description="Cẩm nang Đánh giá LLM - Bản dịch tiếng Việt hoàn chỉnh của LLM Evaluation Guidebook từ Hugging Face">
      <HomepageHeader />
      <main className={styles.mainContent}>
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <Heading as="h2">Các chuyên đề chính</Heading>
              <p>Khám phá các khía cạnh khác nhau của quy trình đánh giá mô hình ngôn ngữ lớn</p>
            </div>
            <div className={styles.cardGrid}>
              {cards.map((card, idx) => (
                <Link to={card.link} key={idx} className={`${styles.card} glass-panel`}>
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <Heading as="h3" className={styles.cardTitle}>
                    {card.title}
                  </Heading>
                  <p className={styles.cardDescription}>{card.description}</p>
                  <div className={styles.cardFooter}>
                    <span>Xem chi tiết</span>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
