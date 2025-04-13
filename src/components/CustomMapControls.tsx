import { useControl, MapboxGeoJSONFeature } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';

// Ensure mapboxgl is available
declare global {
  interface Window {
    mapboxgl?: typeof mapboxgl;
  }
}

const mapboxglInstance = mapboxgl;

interface CustomAttributionProps {
  compact?: boolean;
  customAttribution?: string | string[];
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function CustomAttribution(props: CustomAttributionProps) {
  useControl(
    () => {
      const attribution = new mapboxglInstance.AttributionControl({
        compact: props.compact || true,
        customAttribution: props.customAttribution || 'Hukie Dating App'
      });

      // Apply custom styling to the attribution control
      const originalOnAdd = attribution.onAdd;
      attribution.onAdd = function(map) {
        const element = originalOnAdd.call(this, map);

        // Add custom class for styling
        element.className += ' hukie-attribution';

        // Find the inner element and modify it
        const inner = element.querySelector('.mapboxgl-ctrl-attrib-inner');
        if (inner) {
          // Keep only our custom attribution
          const links = inner.querySelectorAll('a');
          links.forEach(link => {
            if (!link.textContent?.includes('Hukie')) {
              link.style.display = 'none';
            }
          });
        }

        return element;
      };

      return attribution;
    },
    { position: props.position || 'bottom-right' }
  );

  return null;
}

interface CustomLogoProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export function CustomLogo(props: CustomLogoProps) {
  useControl(
    () => {
      // Create a custom control for our own logo
      const control = new mapboxglInstance.Control();

      control.onAdd = function() {
        const container = document.createElement('div');
        container.className = 'mapboxgl-ctrl hukie-logo-container';
        container.style.margin = '0';
        container.style.padding = '0';

        const logo = document.createElement('img');
        logo.src = '/logo.png';
        logo.alt = 'Hukie';
        logo.className = 'hukie-map-logo';
        logo.style.width = '24px';
        logo.style.height = '24px';
        logo.style.borderRadius = '4px';

        container.appendChild(logo);
        return container;
      };

      return control;
    },
    { position: props.position || 'bottom-left' }
  );

  return null;
}
