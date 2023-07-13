import { Layout } from '../layout/Layout';

export function Base() {
  const theme = 'theme-dark';
  return (
    // TODO : Implement theme switch
    <div className={`${theme}`}>
      <Layout>
        <div className="text-neutral">Hello_world!</div>
      </Layout>
    </div>
  );
}
