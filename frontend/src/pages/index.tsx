import Head from 'next/head';
import Link from 'next/link';
import { Geist } from 'next/font/google';
import styles from '@/styles/Home.module.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export default function Home() {
  return (
    <>
      <Head>
        <title>AWS CI/CD Monorepo</title>
        <meta name="description" content="Full-stack monorepo with Next.js and NestJS" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.page} ${geistSans.variable}`}>
        <main className={styles.main}>
          <div className={styles.intro}>
            <h1>AWS CI/CD Monorepo</h1>
            <p>
              A full-stack application built with Next.js frontend and NestJS backend,
              using TypeORM with PostgreSQL. Managed with Turborepo for efficient
              monorepo development.
            </p>
          </div>
          <div className={styles.ctas}>
            <Link href="/values" className={styles.primary}>
              Manage Values
            </Link>
            <a
              className={styles.secondary}
              href={`${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'}/health`}
              target="_blank"
              rel="noopener noreferrer"
            >
              API Health Check
            </a>
          </div>
        </main>
      </div>
    </>
  );
}
