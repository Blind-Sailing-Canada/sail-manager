import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IconTextModule } from './icon-text.module';
import { Component } from '@angular/core';

@Component({
  template: `
    <app-icon-text
    text="FOOBAR"></app-icon-text>`
})
class TestHostComponent {

}

describe('Icon-Text Component', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IconTextModule
      ],
      declarations: [TestHostComponent],
      providers: [],
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TestHostComponent);
        fixture.detectChanges();
      })
      .catch(error => console.error(error));
  }));
  it('should display text', () => {
    expect(fixture.nativeElement).toMatchSnapshot();
  });
});
