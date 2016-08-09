package org.richardhair.timekeeper;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class TimesheetEntry {
	
	public static final String SCHEMA_NAME = "timesheet";
	public static final String TABLE_NAME = SCHEMA_NAME + ".entry";
	public static final String INSERT_ENTRY = "insert into " + TABLE_NAME + "(EntryName, EntryCode) values ('?', '?')";
	public static final String DELETE_ENTRY = "delete from " + TABLE_NAME + " where id=?"; 
	
	private String name;
	private String code;
	private Long id;
	
	public static void main(String[] args) {
		TimesheetEntry entry = new TimesheetEntry("Phoenix Tasks", "1244432544");
		
		String dbUrl = "jdbc:mysql://localhost:3306/timekeeper";
		String username = "";
		String password = "";
		
		
		Connection connection;
		try {
			connection = DriverManager.getConnection(dbUrl, username, password);
			entry.save(connection);
		} catch (SQLException e) {
			e.printStackTrace();
		}
		
	}
	
	public TimesheetEntry (String name, String code) {
		this.name = name;
		this.code = code;
	}
	
	public TimesheetEntry (String name) {
		this.name = name;
	}
	
	public void save(Connection connection) throws SQLException{
		
		PreparedStatement stmt = connection.prepareStatement(INSERT_ENTRY);
		stmt.setString(1, this.name);
		stmt.setString(2, this.code);
		stmt.execute();
	}
	
	public boolean Delete(Connection connection) throws SQLException{
		return false;
	}
	
	private boolean savedToDB(){
		return id != null;
	}

}
