import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:location/location.dart';

final accessToken =
    'pk.eyJ1IjoidW1pdGNpdmkiLCJhIjoiY2t4bWhwbzcwMW00ZDJxcGUybThjeGRiMiJ9.QeIXS7mcBoddAC2rquUbeQ';

class LiveCargoLocation extends StatefulWidget {
  static final String routeName = '/home_screen';

  @override
  _HomeScreenState createState() => _HomeScreenState();
}

class _HomeScreenState extends State<LiveCargoLocation> {
  @override
  void initState() {
    super.initState();
  }

  getCurrentLocation() async {
    Location location = new Location();

    bool _serviceEnabled;
    PermissionStatus _permissionGranted;
    LocationData _locationData;

    _serviceEnabled = await location.serviceEnabled();
    if (!_serviceEnabled) {
      _serviceEnabled = await location.requestService();
      if (!_serviceEnabled) {
        return;
      }
    }

    _permissionGranted = await location.hasPermission();
    if (_permissionGranted == PermissionStatus.denied) {
      _permissionGranted = await location.requestPermission();
      if (_permissionGranted != PermissionStatus.granted) {
        return;
      }
    }

    _locationData = await location.getLocation();

    setState(() {
      _center = LatLng(_locationData.latitude!, _locationData.longitude!);
      _mapController.move(LatLng(_locationData.latitude!, _locationData.longitude!), 13.0);

    });
  }
  var _center = LatLng(39.867855,32.748933);
  var _location = LatLng(39.920825,32.854122);
  MapController _mapController = MapController();

  Widget build(BuildContext context) {
    return SafeArea(
      child: Scaffold(
        resizeToAvoidBottomInset: false,
        floatingActionButton: FloatingActionButton(
          onPressed: getCurrentLocation,
          child: const Icon(Icons.location_on,size:30),
        ),
        body: SafeArea(
          child: Column(
            children: <Widget>[
              Container(
                height: MediaQuery.of(context).size.height-31,
                width: MediaQuery.of(context).size.width,
                child: FlutterMap(
                  options: MapOptions(
                    center: _center,
                    zoom: 13.0,
                  ),
                  mapController: _mapController,
                  layers: [
                    TileLayerOptions(
                      urlTemplate: "https://api.mapbox.com/styles/v1/umitcivi/ckxmi1hhv6csu15nxd4yy10n5/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoidW1pdGNpdmkiLCJhIjoiY2t4bWhwbzcwMW00ZDJxcGUybThjeGRiMiJ9.QeIXS7mcBoddAC2rquUbeQ",
                      additionalOptions: {
                        'accessToken': accessToken,
                        'id': 'mapbox.mapbox-streets-v8',
                      },
                    ),
                    MarkerLayerOptions(
                      markers: [
                        Marker(
                          point: (_location)!,
                          builder: (ctx) => Container(
                            child: Icon(
                              Icons.account_circle,
                              color: Colors.red.shade900,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}