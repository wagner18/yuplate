import { Component, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { ViewController, NavParams, Slides, Content, Platform } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';

declare var window;

// Photo interface
export interface Photo {
    url: string;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'gallery-modal',
  templateUrl: 'gallery-modal.html',
})
export class GalleryModal {
  @ViewChild('slider') slider: Slides;
  @ViewChild('content') content: Content;

  public photos: Photo[];
  public sliderDisabled: boolean = false;
  public initialSlide: number = 0;
  public currentSlide: number = 0;
  public sliderLoaded: boolean = false;
  public closeIcon: string = 'arrow-back';
  public parentSubject: Subject<any> = new Subject();

  constructor(
    public viewCtrl: ViewController, 
    public params: NavParams, 
    public element: ElementRef, 
    public platform: Platform
  ) {
    this.photos = params.get('photos') || [];
    this.closeIcon = params.get('closeIcon') || 'arrow-back';
    this.initialSlide = params.get('initialSlide') || 0;
  }

  /**
   * Closes the modal (when user click on CLOSE)
   */
  dismiss() {
    this.viewCtrl.dismiss();
  }

  resize(event) {
    this.slider.update();

    let width = this.element['nativeElement'].offsetWidth;
    let height = this.element['nativeElement'].offsetHeight;

    this.parentSubject.next({
      width: width,
      height: height,
    });
  }

  orientationChange(event) {
    // TODO: See if you can remove timeout
    window.setTimeout(() => {
      this.resize(event);
    }, 150);
  }

  /**
   * When the modal has entered into view
   */
  ionViewDidEnter() {
    this.resize(false);
    this.sliderLoaded = true;
  }

  /**
   * Disables the scroll through the slider
   *
   * @param  {Event} event
   */
  disableScroll(event) {
    if (!this.sliderDisabled) {
      this.currentSlide = this.slider.getActiveIndex();
      this.sliderDisabled = true;
    }
  }

  /**
   * Enables the scroll through the slider
   *
   * @param  {Event} event
   */
  enableScroll(event) {
    if (this.sliderDisabled) {
      this.slider.slideTo(this.currentSlide, 0, false);
      this.sliderDisabled = false;
    }
  }
}
