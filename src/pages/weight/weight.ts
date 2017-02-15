import { Component, NgZone } from '@angular/core';
import { DbService } from '../../services/firebase/firebase.db.service';
import { ViewService } from '../../services/view/view.service';

@Component({
  selector: 'page-weight',
  templateUrl: 'weight.html',
})

export class WeightPage {
  
  weights: Array<{title: string, desc: string}> = [];
  editMode: boolean;
  newWeight: string = "";
  newDate: Date = new Date();

  constructor(
    private zone: NgZone,
    private db: DbService
  ) {
    
    console.log('WeightListPage: constructor');

    this.getWeight();
  };

  ngOnInit() {
    console.log('WeightListPage: ngOnInit');
  }

  keypressNewWeight (event) {
    var code = event.keyCode || event.which;
    if( code === 13 )
    {
      if( event.srcElement.tagName === "INPUT" )
      {
        event.preventDefault();
        this.addWeight();
      }
    }
  }

  getWeight() {
    this.db.getWeights((weights) => {
      this.zone.run(() => this.weights = weights);
      console.log('WeightListPage:: getWeight: ', this.weights);
    });
  }

  // getWeight() {
  //   this.db.getWeight().then((weights) => {
      
  //     console.log(weights);
  //     this.weights = weights;
  //     console.log('WeightListPage:: getWeight: ', this.weights);
  //   });
  // }
  openAddWeight() {
    this.editMode = true;
  }

  addWeight() {
    if(this.newWeight === '') return;

    let value = {
      weight: this.newWeight,
      date: this.newDate
    }

    this.db.addWeight(value, () => {});

    this.newWeight = "";
    this.newDate = new Date();
    this.editMode = false;
    
    // let weightAddModal = this.modalCtrl.create(WeightAddModal);
    // weightAddModal.onDidDismiss(data => {
    //   // firebase save
    //   if (data === null) return;
    //   this.db.addWeight(data);
    // });
    // weightAddModal.present();
  }  

  deleteWeight(key) {
    this.db.deleteWeight(key);
  }
}
