( function ( mw, $ ) {
	QUnit.module( 'ext.centralauth.ForeignApi', QUnit.newMwEnvironment( {
		setup: function () {
			this.server = this.sandbox.useFakeServer();
			this.server.respondImmediately = true;
			this.clock = this.sandbox.useFakeTimers();
		},
		teardown: function () {
			// https://github.com/jquery/jquery/issues/2453
			this.clock.tick();
		},
		config: {
			wgUserName: true
		}
	} ) );

	QUnit.test( 'Anonymous users do not get centralauthtoken', function ( assert ) {
		QUnit.expect( 1 );
		mw.config.set( 'wgUserName', null );

		this.server.respond( function ( request ) {
			request.respond( 200, { 'Content-Type': 'application/json' }, '[]' );
		} );

		var api = new mw.ForeignApi( '//localhost:4242/w/api.php' );

		var spy = this.sandbox.spy( api, 'getCentralAuthToken' );
		api.get( {} );
		assert.ok( !spy.called, 'Anonymous users do not ask for centralauthtoken' );
	} );

	QUnit.test( 'Logged in users get centralauthtoken if not logged in remotely', function ( assert ) {
		QUnit.expect( 1 );
		mw.config.set( 'wgUserName', 'User' );

		this.sandbox.stub( mw.ForeignApi.prototype, 'checkForeignLogin' ).returns(
			$.Deferred().reject()
		);

		this.server.respond( function ( request ) {
			request.respond( 200, { 'Content-Type': 'application/json' }, '[]' );
		} );

		var api = new mw.ForeignApi( '//localhost:4242/w/api.php' );

		var spy = this.sandbox.stub( api, 'getCentralAuthToken' ).returns(
			$.Deferred().resolve( 'CENTRALAUTHTOKEN' )
		);
		api.get( {} );
		assert.ok( spy.called, 'Logged in users ask for centralauthtoken if not logged in remotely' );
	} );

	QUnit.test( 'Logged in users do not get centralauthtoken if logged in remotely', function ( assert ) {
		QUnit.expect( 1 );
		mw.config.set( 'wgUserName', 'User' );

		this.sandbox.stub( mw.ForeignApi.prototype, 'checkForeignLogin' ).returns(
			$.Deferred().resolve()
		);

		this.server.respond( function ( request ) {
			request.respond( 200, { 'Content-Type': 'application/json' }, '[]' );
		} );

		var api = new mw.ForeignApi( '//localhost:4242/w/api.php' );

		var spy = this.sandbox.stub( api, 'getCentralAuthToken' ).returns(
			$.Deferred().resolve( 'CENTRALAUTHTOKEN' )
		);
		api.get( {} );
		assert.ok( !spy.called, 'Logged in users do not ask for centralauthtoken if logged in remotely' );
	} );

}( mediaWiki, jQuery ) );
