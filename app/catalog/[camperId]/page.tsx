'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getCamperById,
  getCamperReviews,
  createBookingRequest,
} from '@/lib/api';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import { FreeMode, Navigation, Thumbs } from 'swiper/modules';

import toast, { Toaster } from 'react-hot-toast';

import styles from './CamperDetails.module.css';

export default function CamperDetailsPage() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  const { camperId } = useParams();

  const [form, setForm] = useState({
    name: '',
    email: '',
  });

  const { data: camper, isLoading } = useQuery({
    queryKey: ['camper', camperId],
    queryFn: () => getCamperById(camperId as string),
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ['reviews', camperId],
    queryFn: () => getCamperReviews(camperId as string),
  });

  const bookingMutation = useMutation({
    mutationFn: () => createBookingRequest(camperId as string, form),

    onSuccess: data => {
      toast.success(data.message);

      setForm({
        name: '',
        email: '',
      });
    },
  });

  if (isLoading || !camper) {
    return <div className={styles.loading}>Loading...</div>;
  }

  // console.log(camper.gallery);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <span key={i}>{i < rating ? '★' : '☆'}</span>
    ));

  return (
    <div className={styles.wrapper}>
      <Toaster />

      <div className={styles.topSection}>
        <div className={styles.galleryBlock}>
          <Swiper
            loop={true}
            spaceBetween={10}
            navigation={false}
            thumbs={{ swiper: thumbsSwiper }}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper2"
          >
            {camper.gallery.map(image => (
              <SwiperSlide key={image.id}>
                <img src={image.original} alt={camper.name} />
              </SwiperSlide>
            ))}
          </Swiper>

          <Swiper
            onSwiper={setThumbsSwiper}
            loop={false}
            spaceBetween={32}
            slidesPerView={4}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mySwiper"
          >
            {camper.gallery.map(image => (
              <SwiperSlide key={image.id}>
                <img src={image.thumb} alt={camper.name} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className={styles.infoCard}>
          <h1>{camper.name}</h1>

          <div className={styles.meta}>
            ⭐ {camper.rating}({camper.totalReviews} Reviews) •{' '}
            {camper.location}
          </div>

          <div className={styles.price}>€{camper.price}</div>

          <p className={styles.description}>{camper.description}</p>

          <div className={styles.details}>
            <h2>Vehicle details</h2>

            <div className={styles.tags}>
              <span>{camper.transmission}</span>
              <span>{camper.engine}</span>
              <span>{camper.form}</span>

              {camper.amenities?.map(item => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <div className={styles.specRow}>
              <span>Form</span>
              <span>{camper.form}</span>
            </div>

            <div className={styles.specRow}>
              <span>Length</span>
              <span>{camper.length}</span>
            </div>

            <div className={styles.specRow}>
              <span>Width</span>
              <span>{camper.width}</span>
            </div>

            <div className={styles.specRow}>
              <span>Height</span>
              <span>{camper.height}</span>
            </div>

            <div className={styles.specRow}>
              <span>Tank</span>
              <span>{camper.tank}</span>
            </div>

            <div className={styles.specRow}>
              <span>Consumption</span>
              <span>{camper.consumption}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <h2>Reviews</h2>
        <div className={styles.review}>
          <div className={styles.reviews}>
            {reviews.map(review => (
              <div key={review.id} className={styles.reviewCard}>
                <div className={styles.avatar}>{review.reviewer_name[0]}</div>

                <div>
                  <h4>{review.reviewer_name}</h4>

                  <div className={styles.stars}>
                    {renderStars(review.reviewer_rating)}
                  </div>

                  <p>{review.comment}</p>
                </div>
              </div>
            ))}
          </div>

          <form
            className={styles.booking}
            onSubmit={e => {
              e.preventDefault();
              bookingMutation.mutate();
            }}
          >
            <h2>Book your campervan now</h2>

            <p>Stay connected! We are always ready to help you.</p>

            <input
              placeholder="Name*"
              value={form.name}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
            />

            <input
              placeholder="Email*"
              type="email"
              value={form.email}
              onChange={e =>
                setForm(prev => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
            />

            <button type="submit" disabled={bookingMutation.isPending}>
              {bookingMutation.isPending ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
