/* eslint-disable */
import {
  ShapePath,
  Vector2
} from 'three'

function parsePathNode( node ) {

  var path = new ShapePath();

  var point = new Vector2();
  var control = new Vector2();

  var firstPoint = new Vector2();
  var isFirstPoint = true;
  var doSetFirstPoint = false;

  var d = node.getAttribute( 'd' );

  // console.log( d );

  var commands = d.match( /[a-df-z][^a-df-z]*/ig );

  for ( var i = 0, l = commands.length; i < l; i ++ ) {

    var command = commands[ i ];

    var type = command.charAt( 0 );
    var data = command.substr( 1 ).trim();

    if ( isFirstPoint === true ) {

      doSetFirstPoint = true;
      isFirstPoint = false;

    }

    switch ( type ) {

      case 'M':
        var numbers = parseFloats( data );
        for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {

          point.x = numbers[ j + 0 ];
          point.y = numbers[ j + 1 ];
          control.x = point.x;
          control.y = point.y;

          if ( j === 0 ) {

            path.moveTo( point.x, point.y );

          } else {

            path.lineTo( point.x, point.y );

          }

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'H':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j ++ ) {

          point.x = numbers[ j ];
          control.x = point.x;
          control.y = point.y;
          path.lineTo( point.x, point.y );

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'V':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j ++ ) {

          point.y = numbers[ j ];
          control.x = point.x;
          control.y = point.y;
          path.lineTo( point.x, point.y );

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'L':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {

          point.x = numbers[ j + 0 ];
          point.y = numbers[ j + 1 ];
          control.x = point.x;
          control.y = point.y;
          path.lineTo( point.x, point.y );

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'C':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 6 ) {

          path.bezierCurveTo(
            numbers[ j + 0 ],
            numbers[ j + 1 ],
            numbers[ j + 2 ],
            numbers[ j + 3 ],
            numbers[ j + 4 ],
            numbers[ j + 5 ]
          );
          control.x = numbers[ j + 2 ];
          control.y = numbers[ j + 3 ];
          point.x = numbers[ j + 4 ];
          point.y = numbers[ j + 5 ];

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'S':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 4 ) {

          path.bezierCurveTo(
            getReflection( point.x, control.x ),
            getReflection( point.y, control.y ),
            numbers[ j + 0 ],
            numbers[ j + 1 ],
            numbers[ j + 2 ],
            numbers[ j + 3 ]
          );
          control.x = numbers[ j + 0 ];
          control.y = numbers[ j + 1 ];
          point.x = numbers[ j + 2 ];
          point.y = numbers[ j + 3 ];

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'Q':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 4 ) {

          path.quadraticCurveTo(
            numbers[ j + 0 ],
            numbers[ j + 1 ],
            numbers[ j + 2 ],
            numbers[ j + 3 ]
          );
          control.x = numbers[ j + 0 ];
          control.y = numbers[ j + 1 ];
          point.x = numbers[ j + 2 ];
          point.y = numbers[ j + 3 ];

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'T':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {

          var rx = getReflection( point.x, control.x );
          var ry = getReflection( point.y, control.y );
          path.quadraticCurveTo(
            rx,
            ry,
            numbers[ j + 0 ],
            numbers[ j + 1 ]
          );
          control.x = rx;
          control.y = ry;
          point.x = numbers[ j + 0 ];
          point.y = numbers[ j + 1 ];

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'A':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 7 ) {

          var start = point.clone();
          point.x = numbers[ j + 5 ];
          point.y = numbers[ j + 6 ];
          control.x = point.x;
          control.y = point.y;
          parseArcCommand(
            path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
          );

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'm':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {

          point.x += numbers[ j + 0 ];
          point.y += numbers[ j + 1 ];
          control.x = point.x;
          control.y = point.y;

          if ( j === 0 ) {

            path.moveTo( point.x, point.y );

          } else {

            path.lineTo( point.x, point.y );

          }

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'h':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j ++ ) {

          point.x += numbers[ j ];
          control.x = point.x;
          control.y = point.y;
          path.lineTo( point.x, point.y );

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'v':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j ++ ) {

          point.y += numbers[ j ];
          control.x = point.x;
          control.y = point.y;
          path.lineTo( point.x, point.y );

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'l':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {

          point.x += numbers[ j + 0 ];
          point.y += numbers[ j + 1 ];
          control.x = point.x;
          control.y = point.y;
          path.lineTo( point.x, point.y );

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'c':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 6 ) {

          path.bezierCurveTo(
            point.x + numbers[ j + 0 ],
            point.y + numbers[ j + 1 ],
            point.x + numbers[ j + 2 ],
            point.y + numbers[ j + 3 ],
            point.x + numbers[ j + 4 ],
            point.y + numbers[ j + 5 ]
          );
          control.x = point.x + numbers[ j + 2 ];
          control.y = point.y + numbers[ j + 3 ];
          point.x += numbers[ j + 4 ];
          point.y += numbers[ j + 5 ];

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 's':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 4 ) {

          path.bezierCurveTo(
            getReflection( point.x, control.x ),
            getReflection( point.y, control.y ),
            point.x + numbers[ j + 0 ],
            point.y + numbers[ j + 1 ],
            point.x + numbers[ j + 2 ],
            point.y + numbers[ j + 3 ]
          );
          control.x = point.x + numbers[ j + 0 ];
          control.y = point.y + numbers[ j + 1 ];
          point.x += numbers[ j + 2 ];
          point.y += numbers[ j + 3 ];

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'q':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 4 ) {

          path.quadraticCurveTo(
            point.x + numbers[ j + 0 ],
            point.y + numbers[ j + 1 ],
            point.x + numbers[ j + 2 ],
            point.y + numbers[ j + 3 ]
          );
          control.x = point.x + numbers[ j + 0 ];
          control.y = point.y + numbers[ j + 1 ];
          point.x += numbers[ j + 2 ];
          point.y += numbers[ j + 3 ];

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 't':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 2 ) {

          var rx = getReflection( point.x, control.x );
          var ry = getReflection( point.y, control.y );
          path.quadraticCurveTo(
            rx,
            ry,
            point.x + numbers[ j + 0 ],
            point.y + numbers[ j + 1 ]
          );
          control.x = rx;
          control.y = ry;
          point.x = point.x + numbers[ j + 0 ];
          point.y = point.y + numbers[ j + 1 ];

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'a':
        var numbers = parseFloats( data );

        for ( var j = 0, jl = numbers.length; j < jl; j += 7 ) {

          var start = point.clone();
          point.x += numbers[ j + 5 ];
          point.y += numbers[ j + 6 ];
          control.x = point.x;
          control.y = point.y;
          parseArcCommand(
            path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
          );

          if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

        }
        break;

      case 'Z':
      case 'z':
        path.currentPath.autoClose = true;

        if ( path.currentPath.curves.length > 0 ) {

          // Reset point to beginning of Path
          point.copy( firstPoint );
          path.currentPath.currentPoint.copy( point );
          isFirstPoint = true;

        }
        break;

      default:
        console.warn( command );

    }

    // console.log( type, parseFloats( data ), parseFloats( data ).length  )

    doSetFirstPoint = false;

  }

  return path;

}