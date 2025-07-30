-- Rider Tracker App Database Schema for MemFire Cloud
-- Run this script in your MemFire Cloud SQL editor

-- Create profiles table
CREATE TABLE profiles (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  preferred_vehicle VARCHAR(20) CHECK (preferred_vehicle IN ('bicycle', 'motorbike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create rides table
CREATE TABLE rides (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  vehicle_type VARCHAR(20) NOT NULL CHECK (vehicle_type IN ('bicycle', 'motorbike')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('recording', 'paused', 'completed', 'cancelled')),
  start_location JSONB NOT NULL,
  end_location JSONB,
  duration INTEGER, -- in milliseconds
  distance NUMERIC, -- in meters
  route_points JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Create route_points table
CREATE TABLE route_points (
  id SERIAL PRIMARY KEY,
  ride_id INTEGER NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  speed NUMERIC,
  altitude NUMERIC
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_rides_user_id ON rides(user_id);
CREATE INDEX idx_rides_created_at ON rides(created_at DESC);
CREATE INDEX idx_rides_status ON rides(status);
CREATE INDEX idx_route_points_ride_id ON route_points(ride_id);
CREATE INDEX idx_route_points_timestamp ON route_points(timestamp);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Comments for documentation
COMMENT ON TABLE profiles IS 'User profiles with preferences and settings';
COMMENT ON TABLE rides IS 'Ride records with tracking data and metadata';
COMMENT ON TABLE route_points IS 'Individual GPS points recorded during rides';