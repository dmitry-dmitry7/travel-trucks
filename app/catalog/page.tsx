'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import noCampersImg from '@/public/Image/no-campers-found.png';

import { Camper, getCampers, getFilters } from '@/lib/api';

import { BsMap, BsDiagram3, BsFuelPump } from 'react-icons/bs';
import { IoMdCar } from 'react-icons/io';

import styles from './Catalog.module.css';

const PER_PAGE = 4;

type FiltersState = {
  location: string;
  form: string;
  engine: string;
  transmission: string;
};

export default function CatalogPage() {
  const [filters, setFilters] = useState<FiltersState>({
    location: '',
    form: '',
    engine: '',
    transmission: '',
  });

  const [appliedFilters, setAppliedFilters] = useState<FiltersState>({
    location: '',
    form: '',
    engine: '',
    transmission: '',
  });

  const { data: filterOptions } = useQuery({
    queryKey: ['filters'],
    queryFn: getFilters,
  });

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['campers', appliedFilters],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      getCampers({
        page: pageParam,
        perPage: PER_PAGE,
        ...appliedFilters,
      }),
    getNextPageParam: lastPage => {
      return lastPage.page < lastPage.totalPages
        ? lastPage.page + 1
        : undefined;
    },
  });

  const campers = data?.pages.flatMap(page => page.campers) ?? [];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppliedFilters(filters);
  };

  const clearFilters = () => {
    const empty = {
      location: '',
      form: '',
      engine: '',
      transmission: '',
    };

    setFilters(empty);
    setAppliedFilters(empty);
  };

  return (
    <div className={styles.container}>
      {(isLoading || (isFetching && !isFetchingNextPage)) && (
        <div className={styles.loaderOverlay}>
          <div className={styles.loaderModal}>
            <div className={styles.spinner}></div>

            <h3>Loading tracks...</h3>
            <br />

            <p>Please wait while we fetch the best travel trucks for you</p>
          </div>
        </div>
      )}

      <aside className={styles.sidebar}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Location
            <div className={styles.inputWrapper}>
              <BsMap className={styles.inputIcon} />

              <input
                type="text"
                placeholder="Kyiv"
                value={filters.location}
                onChange={e =>
                  setFilters(prev => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                className={styles.input}
              />
            </div>
          </label>

          <h3>Filters</h3>

          <div className={styles.group}>
            <p className={styles.groupName}>Camper form</p>

            {filterOptions?.forms.map(form => (
              <label key={form} className={styles.radio}>
                <input
                  type="radio"
                  name="form"
                  checked={filters.form === form}
                  onChange={() =>
                    setFilters(prev => ({
                      ...prev,
                      form,
                    }))
                  }
                />
                {form}
              </label>
            ))}
          </div>

          <div className={styles.group}>
            <p className={styles.groupName}>Engine</p>

            {filterOptions?.engines.map(engine => (
              <label key={engine} className={styles.radio}>
                <input
                  type="radio"
                  name="engine"
                  checked={filters.engine === engine}
                  onChange={() =>
                    setFilters(prev => ({
                      ...prev,
                      engine,
                    }))
                  }
                />
                {engine}
              </label>
            ))}
          </div>

          <div className={styles.group}>
            <p className={styles.groupName}>Transmission</p>

            {filterOptions?.transmissions.map(transmission => (
              <label key={transmission} className={styles.radio}>
                <input
                  type="radio"
                  name="transmission"
                  checked={filters.transmission === transmission}
                  onChange={() =>
                    setFilters(prev => ({
                      ...prev,
                      transmission,
                    }))
                  }
                />
                {transmission}
              </label>
            ))}
          </div>

          <button type="submit" className={styles.searchBtn}>
            Search
          </button>

          <button
            type="button"
            onClick={clearFilters}
            className={styles.clearBtn}
          >
            Clear filters
          </button>
        </form>
      </aside>

      <section className={styles.catalog}>
        {!isLoading && campers.length === 0 ? (
          <div className={styles.emptyState}>
            <Image
              src={noCampersImg}
              alt="No campers found"
              className={styles.emptyImage}
            />

            <h2>No campers found</h2>

            <p>
              We couldn&apos;t find any campers that match your filters.
              <br />
              Try adjusting your search or clearing some filters.
            </p>

            <div className={styles.emptyActions}>
              <button
                type="button"
                onClick={clearFilters}
                className={styles.emptyClearBtn}
              >
                ✕ Clear filters
              </button>

              <button
                type="button"
                onClick={() =>
                  setAppliedFilters({
                    location: '',
                    form: '',
                    engine: '',
                    transmission: '',
                  })
                }
                className={styles.emptyViewBtn}
              >
                View all campers
              </button>
            </div>
          </div>
        ) : (
          <>
            {campers.map((camper: Camper) => (
              <article key={camper.id} className={styles.card}>
                <img
                  src={camper.coverImage}
                  alt={camper.name}
                  className={styles.image}
                />

                <div className={styles.content}>
                  <div className={styles.header}>
                    <h2>{camper.name}</h2>

                    <span className={styles.price}>€{camper.price}</span>
                  </div>

                  <div className={styles.meta}>
                    ⭐ {camper.rating} ({camper.totalReviews} Reviews)
                    <BsMap className={styles.metaIcon} />
                    {camper.location}
                  </div>

                  <div className={styles.tags}>
                    <span>
                      <BsFuelPump className={styles.tagsFuel} />
                      {camper.engine}
                    </span>
                    <span>
                      <BsDiagram3 className={styles.tagsDiagram} />
                      {camper.transmission}
                    </span>
                    <span>
                      <IoMdCar className={styles.tagsCar} />
                      {camper.form}
                    </span>
                  </div>

                  <Link
                    href={`/catalog/${camper.id}`}
                    target="_blank"
                    className={styles.moreBtn}
                  >
                    Show more
                  </Link>
                </div>
              </article>
            ))}

            {hasNextPage && (
              <button
                className={styles.loadMore}
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading...' : 'Load more'}
              </button>
            )}
          </>
        )}
      </section>
    </div>
  );
}
