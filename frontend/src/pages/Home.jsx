import Hero from '../components/Hero';
import TrendingJewellery from '../components/TrendingJewellery';
import PopularCollections from '../components/PopularCollections';
import { useNavigate } from 'react-router';
import ModelShoot from '../components/ModelShoot';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className='d-flex flex-column gap-5'>
      <Hero onCtaClick={() => navigate('/shop')} />
      <TrendingJewellery />
      <ModelShoot />
      <PopularCollections />
    </div>
  );
}