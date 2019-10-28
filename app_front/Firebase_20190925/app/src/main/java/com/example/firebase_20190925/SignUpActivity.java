package com.example.firebase_20190925;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.example.firebase_20190925.model.Register;
import com.facebook.stetho.Stetho;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import java.util.HashMap;
import java.util.Map;


public class SignUpActivity extends AppCompatActivity {

    private Button registerButton;
    private EditText text_id;
    private EditText text_password;
    private EditText text_name;
    private String s_id;
    private String s_name;
    final FirebaseDatabase database = FirebaseDatabase.getInstance();
    DatabaseReference mRootRef = FirebaseDatabase.getInstance().getReference();
    DatabaseReference conditionRef = mRootRef.child("users");


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_signup);

        text_id = findViewById(R.id.text_id);
        text_password = findViewById(R.id.text_password);
        text_name = findViewById(R.id.text_name);
        registerButton = findViewById(R.id.registerButton);


         s_id=text_id.getText().toString();
         s_name=text_name.getText().toString();

      Map<String, Register> users=new HashMap<>();
      users.put("users",new Register(s_id,s_name));
        conditionRef.setValue(users);

    }
}
//  //  private FirebaseFirestore db = FirebaseFirestore.getInstance();
//    private Button registerButton;
//    private EditText text_id;
//    private EditText text_password;
//    private EditText text_name;
//
//    DatabaseReference mRootRef = FirebaseDatabase.getInstance().getReference();
//    DatabaseReference conditionRef = mRootRef.child("id");
//
//
//    @Override
//    protected void onCreate(Bundle savedInstanceState) {
//        super.onCreate(savedInstanceState);
//        setContentView(R.layout.activity_signup);
//        text_id = findViewById(R.id.text_id);
////        text_password = findViewById(R.id.text_password);
////        text_name = findViewById(R.id.text_name);
//        registerButton = findViewById(R.id.registerButton);
//
//
//    }
//
//    @Override
//    protected void onStart() {
//        super.onStart();
//
//        conditionRef.addValueEventListener(new ValueEventListener() {
//            @Override
//            public void onDataChange(DataSnapshot dataSnapshot) {
//
//                String id = dataSnapshot.getValue(String.class);
//             //   String name = dataSnapshot.getValue(String.class);
//                text_id.setText(id);
//             //   text_name.setText(name);
//            }
//
//            @Override
//            public void onCancelled(DatabaseError databaseError) {
//
//            }
//
//        });
//        registerButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                conditionRef.setValue(text_id.getText().toString());
////                conditionRef.child("id").setValue(text_id.getText().toString());
//
//            }
//        });
//    }
//}
