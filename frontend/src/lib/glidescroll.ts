'use client';

import { useEffect } from 'react';

/**
 * GlideScroll Animation System Component
 * Handles scroll-triggered animations for headings and sublines across the website
 */

class GlideScroll {
  constructor() {
    this.triggers = [];
    this.options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
      animationClass: 'visible'
    };
    this.init();
  }

  init() {
    // Find all elements with glidescroll-trigger class
    this.triggers = document.querySelectorAll('.glidescroll-trigger');
    
    if (this.triggers.length === 0) return;

    // Create Intersection Observer
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.options
    );

    // Observe all trigger elements
    this.triggers.forEach(trigger => {
      this.observer.observe(trigger);
    });

    // Add scroll event listener for parallax effects
    window.addEventListener('scroll', this.handleScroll.bind(this));
    
    // Add resize event listener
    window.addEventListener('resize', this.handleResize.bind(this));
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add visible class with staggered delay
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        
        // Stop observing after animation
        this.observer.unobserve(entry.target);
      }
    });
  }

  handleScroll() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.glidescroll-parallax');
    
    parallaxElements.forEach(element => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrolled * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  }

  handleResize() {
    // Recalculate positions on resize
    this.triggers.forEach(trigger => {
      this.observer.unobserve(trigger);
      this.observer.observe(trigger);
    });
  }

  // Method to manually trigger animations
  triggerAnimation(element) {
    if (element && element.classList.contains('glidescroll-trigger')) {
      element.classList.add('visible');
    }
  }

  // Method to reset animations
  resetAnimations() {
    this.triggers.forEach(trigger => {
      trigger.classList.remove('visible');
      this.observer.observe(trigger);
    });
  }

  // Cleanup method
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }
}

// Auto-apply GlideScroll classes to headings and sublines
function autoApplyGlideScroll() {
  // Apply to all headings (h1, h2, h3, h4, h5, h6)
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  const sublines = document.querySelectorAll('.subline, .subtitle, .tagline, .description, p.lead, .text-muted');
  
  // Animation types for headings
  const headingAnimations = [
    'glidescroll-heading-left',
    'glidescroll-heading-right', 
    'glidescroll-heading-up',
    'glidescroll-heading-down',
    'glidescroll-heading-scale',
    'glidescroll-heading-flip',
    'glidescroll-heading-rotate',
    'glidescroll-heading-wave',
    'glidescroll-heading-bounce',
    'glidescroll-heading-zoom'
  ];
  
  // Animation types for sublines
  const sublineAnimations = [
    'glidescroll-subline-left',
    'glidescroll-subline-right',
    'glidescroll-subline-up', 
    'glidescroll-subline-down',
    'glidescroll-subline-scale',
    'glidescroll-subline-flip',
    'glidescroll-subline-rotate',
    'glidescroll-subline-wave',
    'glidescroll-subline-bounce',
    'glidescroll-subline-zoom'
  ];
  
  // Apply animations to headings
  headings.forEach((heading, index) => {
    // Skip if already has glidescroll class
    if (heading.classList.contains('glidescroll-heading') || 
        heading.classList.contains('glidescroll-trigger')) return;
    
    // Add trigger class
    heading.classList.add('glidescroll-trigger');
    
    // Add random animation class
    const randomAnimation = headingAnimations[index % headingAnimations.length];
    heading.classList.add(randomAnimation);
    
    // Add stagger delay based on index
    const delay = Math.min(index * 100, 1000);
    heading.classList.add(`glidescroll-delay-${delay}`);
    heading.dataset.delay = delay;
    
    // Add direction class for trigger
    if (randomAnimation.includes('left')) {
      heading.classList.add('slide-left');
    } else if (randomAnimation.includes('right')) {
      heading.classList.add('slide-right');
    } else if (randomAnimation.includes('up')) {
      heading.classList.add('slide-up');
    } else if (randomAnimation.includes('down')) {
      heading.classList.add('slide-down');
    }
  });
  
  // Apply animations to sublines
  sublines.forEach((subline, index) => {
    // Skip if already has glidescroll class
    if (subline.classList.contains('glidescroll-subline') || 
        subline.classList.contains('glidescroll-trigger')) return;
    
    // Add trigger class
    subline.classList.add('glidescroll-trigger');
    
    // Add random animation class
    const randomAnimation = sublineAnimations[index % sublineAnimations.length];
    subline.classList.add(randomAnimation);
    
    // Add stagger delay based on index (sublines appear after headings)
    const delay = Math.min((index + 1) * 150, 1500);
    subline.classList.add(`glidescroll-delay-${delay}`);
    subline.dataset.delay = delay;
    
    // Add direction class for trigger
    if (randomAnimation.includes('left')) {
      subline.classList.add('slide-left');
    } else if (randomAnimation.includes('right')) {
      subline.classList.add('slide-right');
    } else if (randomAnimation.includes('up')) {
      subline.classList.add('slide-up');
    } else if (randomAnimation.includes('down')) {
      subline.classList.add('slide-down');
    }
  });
}

export default function GlideScrollScript() {
  useEffect(() => {
    // Initialize GlideScroll when DOM is ready
    let glideScrollInstance: any = null;
    
    const initGlideScroll = () => {
      // Auto-apply GlideScroll classes first
      autoApplyGlideScroll();
      
      // Initialize GlideScroll instance
      glideScrollInstance = new GlideScroll();
      window.glideScroll = glideScrollInstance;
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initGlideScroll);
    } else {
      initGlideScroll();
    }

    // Re-apply on navigation changes (for SPA)
    const handlePopState = () => {
      autoApplyGlideScroll();
    };
    
    window.addEventListener('popstate', handlePopState);

    // Cleanup
    return () => {
      if (glideScrollInstance) {
        glideScrollInstance.destroy();
      }
      document.removeEventListener('DOMContentLoaded', initGlideScroll);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return null; // This component doesn't render anything
}