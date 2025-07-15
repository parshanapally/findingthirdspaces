import React from 'react';
import SEOHead from '../../seo/SEOHead';

const HomePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Finding Third Spaces - Discover Community Spaces Near You"
        description="Find cafés, libraries, coworking spaces, and community centers in your area. Discover where people gather, work, and connect in your local community."
        keywords="third spaces, community spaces, cafes near me, libraries, coworking spaces, local hangouts"
        url="https://findingthirdspaces.com"
      />
      
      {/* Your existing home page content */}
      <main>
        <h1>Discover Third Spaces in Your Community</h1>
        {/* Rest of your content */}
      </main>
    </>
  );
};

export default HomePage;