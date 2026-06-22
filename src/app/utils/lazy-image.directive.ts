import { Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2 } from '@angular/core';

@Directive({
  selector: 'img[lazyLoad]',
  standalone: true
})
export class LazyImageDirective implements OnInit, OnDestroy {
  @Input() lazyLoad: string = '';
  @Input() thumbnail: boolean = false;
  
  private observer?: IntersectionObserver;
  private scrollTimeout?: any;
  private hasLoaded = false;

  constructor(
    private el: ElementRef<HTMLImageElement>,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    // Set placeholder
    this.renderer.setAttribute(
      this.el.nativeElement,
      'src',
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23f0f0f0" width="100" height="100"/%3E%3C/svg%3E'
    );

    // Create intersection observer with a root margin to preload slightly before visible
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.hasLoaded) {
            // Debounce loading - only load if element stays visible for 150ms
            this.scrollTimeout = setTimeout(() => {
              this.loadImage();
            }, 150);
          } else if (!entry.isIntersecting && this.scrollTimeout) {
            // Cancel loading if element leaves viewport before timeout
            clearTimeout(this.scrollTimeout);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before element enters viewport
        threshold: 0.01
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  private loadImage() {
    if (this.hasLoaded) return;
    this.hasLoaded = true;

    const imageUrl = this.lazyLoad;

    const img = new Image();
    img.onload = () => {
      this.renderer.setAttribute(this.el.nativeElement, 'src', imageUrl);
      this.renderer.addClass(this.el.nativeElement, 'loaded');
    };
    img.onerror = () => {
      // Fallback if image fails to load
      this.renderer.setAttribute(
        this.el.nativeElement,
        'src',
        'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Crect fill="%23e0e0e0" width="100" height="100"/%3E%3Ctext x="50" y="50" text-anchor="middle" fill="%23999" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E'
      );
    };
    img.src = imageUrl;
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
  }
}
