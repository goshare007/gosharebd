const EditPackagePage = ({ params }: { params: { packageId: string } }) => {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-4'>
        Edit Package #{params.packageId}
      </h1>
      <p>A form to edit the package details will be displayed here.</p>
    </div>
  );
};

export default EditPackagePage;
