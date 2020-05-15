import React from 'react';
import ReactMarkdown from 'react-markdown';
import Layout from '../components/layout';
import rules from '../components/rules_of_the_game.md';

export default function Rules() {
  return (
    <Layout>
      <ReactMarkdown
        source={rules}
        escapeHtml={false}
      />
    </Layout>
  );
}
