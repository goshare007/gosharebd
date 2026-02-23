const SingleBookingPage = ({ params }: { params: { bookingId: string } }) => {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>
        View Booking #{params.bookingId}
      </h1>
      <p>Detailed information for a single booking will be displayed here.</p>
    </div>
  );
};

export default SingleBookingPage;
