import image1 from '../assets/jewellery-model-shoot1.webp';
import image2 from '../assets/jewellery-model-shoot2.webp';

const DiscoverImages = () => {
  return (
    <section className="py-3">
      <div className="row g-0">
        <div className="col-6">
          <img
            src={image1}
            alt="Model wearing Gold Threads jewellery"
            className="discover-image w-100 object-fit-cover"
          />
        </div>
        <div className="col-6">
          <img
            src={image2}
            alt="Close-up of Gold Threads jewellery styling"
            className="discover-image w-100 object-fit-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default DiscoverImages;