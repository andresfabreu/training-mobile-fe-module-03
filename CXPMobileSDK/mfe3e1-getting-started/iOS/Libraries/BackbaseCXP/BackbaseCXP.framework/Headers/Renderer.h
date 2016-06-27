//
//  Renderer.h
//  BackbaseCXP
//
//  Created by Backbase R&D B.V. on 27/02/15.
//

#import <Foundation/Foundation.h>
@protocol RendererDelegate;
@protocol Renderable;

/**
 * Renderer protocol.
 * Objects conforming this protocol are able to render Renderable items and control their graphical properties.
 */
@protocol Renderer <NSObject>
@required

/**
 * Creates a new renderer object, it's required to enable native renderers.
 * @param frame The initial frame size of the native renderer
 * @param item The renderable this renderer is going to draw.
 * @return A new Renderer instance
 */
- (instancetype)initWithFrame:(CGRect)frame item:(NSObject<Renderable>*)item;

/**
 * Starts the rendering of a renderable item in a given container.
 * @param container Container where the item should be rendered.
 * @param error If an error occurs, upon return contains an NSError object that describes the problem.
 */
- (BOOL)start:(UIView*)container error:(NSError**)error;

/**
 * Reloads the current renderable item.
 */
- (void)reload;

/**
 * Gets the size of this renderer.
 * @return The size of the renderer.
 */
- (CGSize)size;

/**
 * Gets the reference of the renderable item used by this renderer. It will come handy with some asynchronous calls and
 * pub sub payloads.
 * @return The reference to the Renderable item used at the start method.
 */
- (NSObject<Renderable>*)item;

/**
 * Enables or disables the scrolling abilities of this renderer. Scrolling is enabled by default.
 * @param enable Enable/disable the scrolling
 */
- (void)enableScrolling:(BOOL)enable;

/**
 *  @return The current state of the scrolling (enable/disabled)
 */
- (BOOL)isScrollingEnabled;

/**
 * Enables or disables the bouncing of the scroll view abilities of this renderer. Bouncing is enabled by default.
 * @param enable Enable/disable the bouncing
 */
- (void)enableBouncing:(BOOL)enable;

/**
 *  @return The current state of the bouncing (enable/disabled)
 */
- (BOOL)isBouncingEnabled;

@optional

/**
 * Dispatches an event in the renderer's window object.
 * @param event The name of the event.
 * @param payload A JSON serializable object.
 */
- (void)dispatchEvent:(NSString*)event payload:(id)payload;

/**
 * Resizes the renderer to the new size.
 * @param newSize The new size (width,height) for the renderer.
 */
- (void)scaleTo:(CGSize)newSize;

/**
 * Resizes the renderer to the new position.
 * @param newPosition The new position (x,y) for the renderer.
 */
- (void)moveTo:(CGPoint)newPosition;

/**
 * Sets a delegate to respond to events created by the Renderer.
 * This should be called <b>BEFORE</b> the rendering has started.
 * @param delegate Instance conforming the protocol to respond to the events.
 */
- (void)delegate:(NSObject<RendererDelegate>*)delegate;
@end
