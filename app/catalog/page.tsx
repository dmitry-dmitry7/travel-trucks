'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { Camper, getCampers, getFilters } from '@/lib/api';

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
          </label>

          <div className={styles.group}>
            <h3>Camper form</h3>

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
            <h3>Engine</h3>

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
            <h3>Transmission</h3>

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
                {' • '}
                {camper.location}
              </div>

              <div className={styles.tags}>
                <span>{camper.engine}</span>
                <span>{camper.transmission}</span>
                <span>{camper.form}</span>
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
      </section>
    </div>
  );
}
