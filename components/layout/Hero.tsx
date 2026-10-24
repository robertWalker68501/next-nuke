import { ArrowRight, MessageCircle, Sparkles, Users } from 'lucide-react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className='page-wrapper py-10 sm:py-14 lg:py-20'>
      <div className='bg-primary/5 relative isolate overflow-hidden rounded-3xl border px-6 py-10 sm:px-10 sm:py-14 lg:px-16 lg:py-16'>
        <div
          aria-hidden='true'
          className='bg-primary/10 absolute -top-28 -right-24 -z-10 size-72 rounded-full blur-3xl'
        />
        <div
          aria-hidden='true'
          className='bg-primary/10 absolute -bottom-40 left-1/4 -z-10 size-80 rounded-full blur-3xl'
        />

        <div className='grid items-center gap-12 lg:grid-cols-2 lg:gap-8'>
          <div className='max-w-xl'>
            <h1 className='text-4xl leading-tight font-bold tracking-tight sm:text-5xl lg:text-6xl'>
              Good things happen when we{' '}
              <span className='text-primary'>talk.</span>
            </h1>
            <p className='text-muted-foreground mt-6 max-w-lg text-lg leading-8'>
              Find your people, trade ideas, and get thoughtful answers. There’s
              a conversation here for whatever you’re curious about.
            </p>

            <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
              <Link
                href='/forums'
                className='bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors'
              >
                Explore the forums
                <ArrowRight
                  aria-hidden='true'
                  className='size-4'
                />
              </Link>
              <Link
                href='/trending'
                className='border-border bg-background hover:bg-muted inline-flex h-11 items-center justify-center rounded-md border px-5 text-sm font-semibold transition-colors'
              >
                See what’s trending
              </Link>
            </div>

            <div className='text-muted-foreground mt-9 flex items-center gap-3 text-sm'>
              <div className='flex -space-x-2'>
                <span className='ring-background flex size-8 items-center justify-center rounded-full bg-amber-200 text-xs font-semibold text-amber-900 ring-2'>
                  J
                </span>
                <span className='ring-background flex size-8 items-center justify-center rounded-full bg-sky-200 text-xs font-semibold text-sky-900 ring-2'>
                  M
                </span>
                <span className='ring-background flex size-8 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-900 ring-2'>
                  A
                </span>
              </div>
              <span>Good conversations are better together.</span>
            </div>
          </div>

          <div
            aria-label='Illustration of a lively community conversation'
            role='img'
            className='relative mx-auto w-full max-w-lg'
          >
            <div className='bg-primary/10 absolute inset-8 rounded-full blur-2xl' />
            <div className='bg-background/80 border-border/80 shadow-primary/10 relative rounded-3xl border p-4 shadow-xl sm:p-6'>
              <div className='mb-5 flex items-center justify-between'>
                <div>
                  <p className='text-muted-foreground text-xs font-medium tracking-widest uppercase'>
                    Community
                  </p>
                  <p className='mt-1 text-lg font-semibold'>The lounge</p>
                </div>
                <div className='text-primary bg-primary/10 flex size-10 items-center justify-center rounded-full'>
                  <Users
                    aria-hidden='true'
                    className='size-5'
                  />
                </div>
              </div>

              <div className='bg-muted/70 rounded-2xl p-4'>
                <div className='mb-4 flex items-center gap-3'>
                  <span className='flex size-9 items-center justify-center rounded-full bg-amber-200 text-sm font-semibold text-amber-900'>
                    J
                  </span>
                  <div>
                    <p className='text-sm font-semibold'>Jordan Lee</p>
                    <p className='text-muted-foreground text-xs'>Just now</p>
                  </div>
                </div>
                <p className='text-sm leading-6'>
                  What’s something small that made your day better?
                </p>
              </div>

              <div className='mt-3 space-y-3 pl-4 sm:pl-8'>
                <div className='border-border bg-background rounded-xl border p-3'>
                  <div className='flex items-start gap-3'>
                    <span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-sky-200 text-xs font-semibold text-sky-900'>
                      M
                    </span>
                    <p className='text-muted-foreground pt-1 text-sm leading-5'>
                      A stranger recommended a great little bookshop 📚
                    </p>
                  </div>
                </div>
                <div className='border-border bg-background rounded-xl border p-3'>
                  <div className='flex items-start gap-3'>
                    <span className='flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-200 text-xs font-semibold text-emerald-900'>
                      A
                    </span>
                    <p className='text-muted-foreground pt-1 text-sm leading-5'>
                      Coffee with an old friend. More of that, please ☕
                    </p>
                  </div>
                </div>
              </div>

              <div className='border-border mt-5 flex items-center gap-3 border-t pt-4'>
                <div className='bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-full'>
                  <MessageCircle
                    aria-hidden='true'
                    className='size-4'
                  />
                </div>
                <p className='text-muted-foreground text-sm'>
                  Your next great conversation starts here.
                </p>
              </div>
            </div>
            <div className='bg-background border-border absolute -bottom-5 -left-3 flex items-center gap-2 rounded-xl border px-4 py-3 shadow-lg sm:-left-8'>
              <span className='size-2 rounded-full bg-emerald-500' />
              <span className='text-sm font-medium'>A place to belong</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
