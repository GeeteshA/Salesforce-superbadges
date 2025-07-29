import { createElement } from 'lwc';
import UnitTest from 'c/unitTest';
describe('c-unit-test', () => {
  afterEach(() => {
    
    while(document.body.firstChild) {
      document.body.removeChild(document.body.firstChild);
    }
  });
  it('displays unit status with default unitNumber', () => {
    const element = createElement('c-unit-test', {
      is: UnitTest
    });
    document.body.appendChild(element);
    expect(element.unitNumber).toBe(5);
    
    document.body.appendChild(element);
    
    const div = element.shadowRoot.querySelector('div');
    expect(div.textContent).toBe('Unit 5 alive!');
  });
});