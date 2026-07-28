// import { getCamperById } from '@/lib/api';

interface Props {
  params: {
    camperId: string;
  };
}

export default async function CamperDetailsPage({ params }: Props) {
  const camper = await getCamperById(params.camperId);

  return (
    <main
      style={{
        padding: '40px',
      }}
    >
      <h1>{camper.name}</h1>

      <h2>€{camper.price}</h2>

      {/* Swiper Gallery */}

      <div
        style={{
          display: 'flex',
          gap: '16px',
          marginTop: '24px',
        }}
      >
        {camper.gallery.map((image: string) => (
          <img key={image} src={image} alt="" width={300} />
        ))}
      </div>

      <section
        style={{
          marginTop: '40px',
        }}
      >
        <h2>Reviews</h2>

        {camper.reviews.map((review: any) => (
          <div key={review.id}>
            <h4>{review.reviewer_name}</h4>

            <div>
              {'★'.repeat(review.reviewer_rating)}
              {'☆'.repeat(5 - review.reviewer_rating)}
            </div>

            <p>{review.comment}</p>
          </div>
        ))}
      </section>

      <section
        style={{
          marginTop: '40px',
        }}
      >
        <h2>Book your campervan now</h2>

        <form>
          <input placeholder="Name" name="name" />

          <input placeholder="Email" name="email" />

          <button type="submit">Send</button>
        </form>
      </section>
    </main>
  );
}
