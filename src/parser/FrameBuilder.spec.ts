import FrameBuilder from './FrameBuilder';
import {Fixture} from "../../test/unit/parser/fixture/Fixture";

describe('FrameBuilder', () => {

  test('getFrame should return a frame', () => {
    const orderedParticipants = ['A', 'B', 'C'];
    const frameBuilder = new FrameBuilder(orderedParticipants);
    const context = Fixture.firstStatement('A.method {if(x) {B.method}}');

    // Since there's no children, frameFunc(context) should return an empty frame
    const expectedFrame = { left: 'A', right: 'B', children: [] };
    expect(frameBuilder.getFrame(context)).toEqual(expectedFrame);
  });

  test('getFrame should return a frame', () => {
    const orderedParticipants = ['D', 'C', 'B', 'A'];
    const frameBuilder = new FrameBuilder(orderedParticipants);

    const context = Fixture.firstStatement(`A.method {
      if(x) {
        B.method 
        if(y) {
          C.method {
            if(z) {
              D.method
            }
          }
        }
      }
    }`);


    // Since there's no children, frameFunc(context) should return an empty frame
    const expectedFrame = {
      left: "D",
      right: "A",
      children: [
        {
          left: "D",
          right: "A",
          children: [
            {
              left: "D",
              right: "C",
              children: []
            }
          ]
        }
      ]
    };

    let rootFrame = frameBuilder.getFrame(context);
    expect(rootFrame).toEqual(expectedFrame);
  });

  // ... more tests here ...
});
