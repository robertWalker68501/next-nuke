import Link from 'next/link';

async function CurrentYear() {
  'use cache';

  const year = new Date().getFullYear();

  return <>{year}</>;
}

const Footer = () => {
  return (
    <footer className='border-border border-t py-4'>
      <div className='page-wrapper'>
        <p className='text-center text-sm'>
          NextNuke &copy; <CurrentYear />{' '}
          <Link
            href='/'
            className='hover:text-primary'
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
